package com.example.common.service;

import com.example.common.dto.ImportExcelFile.Request.ImportColumnReq;
import com.example.common.dto.ImportExcelFile.Response.ImportRowErrorRes;
import com.example.common.dto.ImportExcelFile.Response.ImportSummaryRes;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.exception.ExcelImportException;
import com.example.common.interfaces.ImportExcelFile.ImportableExcel;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFDataValidationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@Slf4j
@Service
public class ExcelImportService {

    @Transactional
    public <T> ImportSummaryRes importExcel(MultipartFile file, ImportableExcel<T> importable) {

        List<T> validRows = new ArrayList<>();
        List<ImportRowErrorRes> errors = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);

            if (headerRow == null) {
                throw new AppException(ErrorCode.EXCEL_FILE_EMPTY);
            }

            //? Map: columnIndex -> header text (đọc theo header, không theo index cứng)
            Map<Integer, String> columnIndexToHeader = new HashMap<>();
            for (Cell cell : headerRow) {
                columnIndexToHeader.put(cell.getColumnIndex(), getCellValueAsString(cell).trim());
            }

            List<ImportColumnReq> columns = importable.getColumns();
            Set<String> foundHeaders = new HashSet<>(columnIndexToHeader.values());

            List<String> missingHeaders = columns.stream()
                    .filter(ImportColumnReq::isRequired)
                    .map(ImportColumnReq::getHeader)
                    .filter(header -> !foundHeaders.contains(header))
                    .toList();

            if (!missingHeaders.isEmpty()) {
                throw new RuntimeException("Thiếu cột bắt buộc trong file Excel: " + String.join(", ", missingHeaders));
            }

            int lastRowNum = sheet.getLastRowNum();

            for (int rowIdx = 1; rowIdx <= lastRowNum; rowIdx++) {
                Row row = sheet.getRow(rowIdx);
                if (row == null || isRowEmpty(row)) continue;

                Map<String, String> rawRow = new HashMap<>();
                for (Map.Entry<Integer, String> entry : columnIndexToHeader.entrySet()) {
                    rawRow.put(entry.getValue(), getCellValueAsString(row.getCell(entry.getKey())));
                }

                int excelRowNumber = rowIdx + 1; // +1 vì Excel hiển thị 1-based, header ở dòng 1

                try {
                    T data = importable.mapRow(rawRow, excelRowNumber);
                    List<String> rowErrors = importable.validateRow(data, excelRowNumber);

                    if (rowErrors.isEmpty()) {
                        validRows.add(data);
                    } else {
                        errors.add(new ImportRowErrorRes(excelRowNumber, rowErrors));
                    }
                } catch (Exception e) {
                    errors.add(new ImportRowErrorRes(excelRowNumber, List.of(e.getMessage())));
                }
            }

        } catch (IOException e) {
            log.error("Đọc file Excel thất bại: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.EXCEL_READ_FAILED);
        }

        //* Rollback toàn bộ file nếu có bất kỳ dòng nào lỗi
        if (!errors.isEmpty()) {
            throw new ExcelImportException(errors);
        }

        importable.saveAll(validRows);

        return ImportSummaryRes.builder()
                .importedCount(validRows.size())
                .message("Import thành công " + validRows.size() + " dòng")
                .build();
    }

    public byte[] generateTemplate(ImportableExcel<?> importable) {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            List<ImportColumnReq> columns = importable.getColumns();

            Sheet dataSheet = workbook.createSheet(importable.getSheetName());
            buildDataSheet(workbook, dataSheet, columns);
            buildInstructionSheet(workbook, columns);

            workbook.setActiveSheet(0);
            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new AppException(ErrorCode.EXCEL_READ_FAILED);
        }
    }

    //* ============================ DATA SHEET ============================

    private void buildDataSheet(XSSFWorkbook workbook, Sheet sheet, List<ImportColumnReq> columns) {

        CellStyle requiredHeaderStyle = createHeaderStyle(workbook, IndexedColors.DARK_BLUE.getIndex());
        CellStyle optionalHeaderStyle = createHeaderStyle(workbook, IndexedColors.GREY_50_PERCENT.getIndex());
        CellStyle sampleStyle = createSampleStyle(workbook);

        Row headerRow = sheet.createRow(0);
        headerRow.setHeightInPoints(30);

        CreationHelper factory = workbook.getCreationHelper();
        Drawing<?> drawing = sheet.createDrawingPatriarch();

        for (int i = 0; i < columns.size(); i++) {
            ImportColumnReq col = columns.get(i);

            Cell cell = headerRow.createCell(i);
            cell.setCellValue(col.isRequired() ? col.getHeader() + " (*)" : col.getHeader());
            cell.setCellStyle(col.isRequired() ? requiredHeaderStyle : optionalHeaderStyle);

            if (StringUtils.hasText(col.getNote())) {
                ClientAnchor anchor = factory.createClientAnchor();
                anchor.setCol1(i);
                anchor.setCol2(i + 3);
                anchor.setRow1(0);
                anchor.setRow2(4);

                Comment comment = drawing.createCellComment(anchor);
                comment.setString(factory.createRichTextString(col.getNote()));
                comment.setAuthor("Van Đình");
                cell.setCellComment(comment);
            }

            sheet.setColumnWidth(i, Math.max(18, col.getHeader().length() + 4) * 256);
        }

        //* Dòng mẫu — row index 1, để user hình dung cách điền
        Row sampleRow = sheet.createRow(1);
        for (int i = 0; i < columns.size(); i++) {
            Cell cell = sampleRow.createCell(i);
            String sample = columns.get(i).getSample();
            if (StringUtils.hasText(sample)) {
                cell.setCellValue(sample);
            }
            cell.setCellStyle(sampleStyle);
        }

        //* Dropdown validation cho các cột có options — áp dụng 200 dòng đầu (từ row 2 trở đi)
        DataValidationHelper validationHelper = new XSSFDataValidationHelper((XSSFSheet) sheet);
        for (int i = 0; i < columns.size(); i++) {
            List<String> options = columns.get(i).getOptions();
            if (options == null || options.isEmpty()) continue;

            DataValidationConstraint constraint = validationHelper
                    .createExplicitListConstraint(options.toArray(new String[0]));
            CellRangeAddressList range = new CellRangeAddressList(2, 200, i, i);
            DataValidation validation = validationHelper.createValidation(constraint, range);
            validation.setShowErrorBox(true);
            validation.createErrorBox("Giá trị không hợp lệ",
                    "Vui lòng chọn 1 trong các giá trị: " + String.join(", ", options));
            sheet.addValidationData(validation);
        }

        sheet.createFreezePane(0, 2);
    }

    //* ============================ INSTRUCTION SHEET ============================

    private void buildInstructionSheet(XSSFWorkbook workbook, List<ImportColumnReq> columns) {
        Sheet sheet = workbook.createSheet("Hướng dẫn");

        CellStyle headerStyle = createHeaderStyle(workbook, IndexedColors.DARK_BLUE.getIndex());
        CellStyle wrapStyle = workbook.createCellStyle();
        wrapStyle.setWrapText(true);
        wrapStyle.setVerticalAlignment(VerticalAlignment.TOP);

        Row header = sheet.createRow(0);
        String[] cols = {"Cột", "Bắt buộc", "Ghi chú", "Giá trị mẫu"};
        for (int i = 0; i < cols.length; i++) {
            Cell c = header.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(headerStyle);
        }

        int rowIdx = 1;
        for (ImportColumnReq col : columns) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(col.getHeader());
            row.createCell(1).setCellValue(col.isRequired() ? "Bắt buộc" : "Không bắt buộc");

            Cell noteCell = row.createCell(2);
            noteCell.setCellValue(col.getNote() != null ? col.getNote() : "");
            noteCell.setCellStyle(wrapStyle);

            row.createCell(3).setCellValue(col.getSample() != null ? col.getSample() : "");
        }

        sheet.setColumnWidth(0, 30 * 256);
        sheet.setColumnWidth(1, 18 * 256);
        sheet.setColumnWidth(2, 60 * 256);
        sheet.setColumnWidth(3, 25 * 256);
    }

    //* ============================ STYLE HELPERS ============================

    private CellStyle createHeaderStyle(Workbook workbook, short colorIndex) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(colorIndex);
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setWrapText(true);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createSampleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setItalic(true);
        font.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setFont(font);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }

    private boolean isRowEmpty(Row row) {
        for (Cell cell : row) {
            if (cell.getCellType() != CellType.BLANK && StringUtils.hasText(getCellValueAsString(cell))) {
                return false;
            }
        }
        return true;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                double value = cell.getNumericCellValue();
                yield (value == Math.floor(value)) ? String.valueOf((long) value) : String.valueOf(value);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

}
