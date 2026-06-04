package com.example.diary.service;

import com.example.common.dto.diary.response.DiaryDayGroup;
import com.example.common.dto.diary.response.GetDiaryDetailRes;
import com.example.common.dto.diary.response.GetListItemsDiary;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.user.UserInternalService;
import com.example.diary.repository.UserDiaryRepository;
import com.example.persistence.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExportDiaryDetailToFileService {

    private final DiaryServiceImpl    diaryService;

    private final UserInternalService userService;

    private final UserDiaryRepository diaryRepository;

    private static final String FONT_NAME = "Times New Roman";

    @Transactional
    public byte[] exportDiaryDetailToExcelFile(String userId, String diaryId) {

        userService.getUserById(userId);

        log.error("==== DIARY ID: {} ====", diaryId);
        diaryRepository.findById(diaryId).orElseThrow(() -> new AppException(ErrorCode.DIARY_NOT_FOUND));

        return exportDiaryToExcel(userId, diaryId);
    }

    private byte[] exportDiaryToExcel(String userId, String diaryId) {

        GetDiaryDetailRes detail  = diaryService.getDiaryDetail(diaryId);
        User              customer = userService.getUserById(userId);

        try (Workbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = wb.createSheet("Phiếu mua hàng");

            CellStyle titleStyle    = createTitleStyle(wb);
            CellStyle subTitleStyle = createSubTitleStyle(wb);
            CellStyle headerStyle   = createHeaderStyle(wb);
            CellStyle dataStyle     = createDataStyle(wb);
            CellStyle dateCenterStyle = createDateCenterStyle(wb);
            CellStyle moneyStyle    = createMoneyStyle(wb);
            CellStyle totalStyle    = createTotalStyle(wb);
            CellStyle totalMoneyStyle = createTotalMoneyStyle(wb);

            // ── Row 0: Tên cửa hàng ──────────────────────────────────────
            Row r0 = sheet.createRow(0);
            r0.setHeightInPoints(28);
            Cell storeCell = r0.createCell(0);
            storeCell.setCellValue("VAN_DINH_STORE");
            storeCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            // ── Row 1: Tiêu đề phiếu ─────────────────────────────────────
            Row r1 = sheet.createRow(1);
            r1.setHeightInPoints(22);
            Cell titleCell = r1.createCell(0);
            titleCell.setCellValue("PHIẾU MUA HÀNG");
            titleCell.setCellStyle(subTitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 6));

            // ── Row 2: Tên khách hàng ─────────────────────────────────────
            Row r2 = sheet.createRow(2);
            r2.setHeightInPoints(18);
            Cell customerCell = r2.createCell(0);
            customerCell.setCellValue("Khách hàng: " + customer.getUserName());
            customerCell.setCellStyle(dataStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 6));

            // ── Row 3: spacer ─────────────────────────────────────────────
            sheet.createRow(3).setHeightInPoints(6);

            // ── Row 4: Header bảng ────────────────────────────────────────
            Row headerRow = sheet.createRow(4);
            headerRow.setHeightInPoints(28);
            String[] cols = {"Ngày", "Tên hàng", "ĐVT", "Màu sắc", "Số lượng", "Đơn giá", "Thành tiền"};
            for (int i = 0; i < cols.length; i++) {
                Cell c = headerRow.createCell(i);
                c.setCellValue(cols[i]);
                c.setCellStyle(headerStyle);
            }

            // ── Data rows ─────────────────────────────────────────────────
            int rowIdx = 5;  // 0-based → Excel row 6

            // ── Data rows ─────────────────────────────────────────────────────────
            for (DiaryDayGroup day : detail.getDays()) {
                boolean firstOfDay = true;

                for (GetListItemsDiary item : day.getItems()) {
                    Row row = sheet.createRow(rowIdx);
                    row.setHeightInPoints(18);

                    // Cột A (0) — Ngày
                    Cell dateCell = row.createCell(0);
                    if (firstOfDay) {
                        dateCell.setCellValue(
                                day.getDate().format(DateTimeFormatter.ofPattern("d/M/yyyy"))
                        );
                        firstOfDay = false;
                    }
                    dateCell.setCellStyle(dateCenterStyle);

                    // Cột B (1) — Tên hàng
                    Cell nameCell = row.createCell(1);
                    nameCell.setCellValue(item.getProductName() != null ? item.getProductName() : "");
                    nameCell.setCellStyle(dataStyle);

                    // Cột C (2) — ĐVT
                    Cell dvtCell = row.createCell(2);
                    dvtCell.setCellValue(item.getVolume() != null ? item.getVolume() : "");
                    dvtCell.setCellStyle(dateCenterStyle);

                    // Cột D (3) — Màu sắc
                    Cell colorCell = row.createCell(3);
                    colorCell.setCellValue(item.getColor() != null ? item.getColor() : "");
                    colorCell.setCellStyle(dateCenterStyle);

                    // Cột E (4) — Số lượng
                    Cell qtyCell = row.createCell(4);  // ✅ index 4
                    qtyCell.setCellValue(item.getQuantity());
                    qtyCell.setCellStyle(dateCenterStyle);

                    // Cột F (5) — Đơn giá
                    Cell priceCell = row.createCell(5);  // ✅ index 5
                    priceCell.setCellValue(item.getUnitPrice().doubleValue());
                    priceCell.setCellStyle(moneyStyle);

                    // Cột G (6) — Thành tiền
                    Cell subtotalCell = row.createCell(6);  // ✅ index 6
                    subtotalCell.setCellFormula("E" + (rowIdx + 1) + "*F" + (rowIdx + 1));  // ✅ E*F
                    subtotalCell.setCellStyle(moneyStyle);

                    applyBorders(row, wb);
                    rowIdx++;
                }
            }

            // ── Dòng TỔNG CỘNG ───────────────────────────────────────────
            Row totalRow = sheet.createRow(rowIdx);
            totalRow.setHeightInPoints(22);

            Cell totalLabel = totalRow.createCell(0);
            totalLabel.setCellValue("TỔNG CỘNG");
            totalLabel.setCellStyle(totalStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx, rowIdx, 0, 5));

            // fill merged cells với style để border hiển thị đều
            for (int col = 1; col <= 5; col++) {
                totalRow.createCell(col).setCellStyle(totalStyle);
            }

            Cell totalValue = totalRow.createCell(6);
            totalValue.setCellFormula("SUM(G6:G" + rowIdx + ")");
            totalValue.setCellStyle(totalMoneyStyle);

            // ── Column widths ─────────────────────────────────────────────
            sheet.setColumnWidth(0, 13 * 256);   // Ngày
            sheet.setColumnWidth(1, 32 * 256);   // Tên hàng
            sheet.setColumnWidth(2,  9 * 256);   // ĐVT
            sheet.setColumnWidth(3, 12 * 256);   // Màu sắc
            sheet.setColumnWidth(4, 11 * 256);   // Số lượng
            sheet.setColumnWidth(5, 14 * 256);   // Đơn giá
            sheet.setColumnWidth(6, 16 * 256);   // Thành tiền

            wb.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new AppException(ErrorCode.EXPORT_EXCEL_FILE_FAILED);
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // STYLE METHODS
    // ══════════════════════════════════════════════════════════════════════

    /** Tên cửa hàng — to, đậm, căn giữa */
    private CellStyle createTitleStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName(FONT_NAME);
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    /** PHIẾU MUA HÀNG — đậm, căn giữa, nhỏ hơn title */
    private CellStyle createSubTitleStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName(FONT_NAME);
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    /** Header bảng — đậm, nền xám, viền, căn giữa */
    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName(FONT_NAME);
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setWrapText(true);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        applyAllBorders(style, BorderStyle.MEDIUM);
        return style;
    }

    /** Data thường — căn trái, viền mỏng */
    private CellStyle createDataStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName(FONT_NAME);
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        applyAllBorders(style, BorderStyle.THIN);
        return style;
    }

    /** Date/ĐVT/SL — căn giữa, viền mỏng */
    private CellStyle createDateCenterStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName(FONT_NAME);
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        applyAllBorders(style, BorderStyle.THIN);
        return style;
    }

    /** Số tiền — format #,##0, căn phải, viền mỏng */
    private CellStyle createMoneyStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName(FONT_NAME);
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        DataFormat fmt = wb.createDataFormat();
        style.setDataFormat(fmt.getFormat("#,##0"));
        applyAllBorders(style, BorderStyle.THIN);
        return style;
    }

    /** TỔNG CỘNG label — đậm, căn giữa, viền đậm */
    private CellStyle createTotalStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName(FONT_NAME);
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        applyAllBorders(style, BorderStyle.MEDIUM);
        return style;
    }

    /** TỔNG CỘNG value — đậm, format tiền, viền đậm */
    private CellStyle createTotalMoneyStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName(FONT_NAME);
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        DataFormat fmt = wb.createDataFormat();
        style.setDataFormat(fmt.getFormat("#,##0"));
        applyAllBorders(style, BorderStyle.MEDIUM);
        return style;
    }

    // ══════════════════════════════════════════════════════════════════════
    // HELPER METHODS
    // ══════════════════════════════════════════════════════════════════════

    /** Set 4 borders cùng 1 style cho CellStyle */
    private void applyAllBorders(CellStyle style, BorderStyle borderStyle) {
        style.setBorderTop(borderStyle);
        style.setBorderBottom(borderStyle);
        style.setBorderLeft(borderStyle);
        style.setBorderRight(borderStyle);
    }

    /** Apply border mỏng cho tất cả cells trong 1 row (dùng style đã có sẵn) */
    private void applyBorders(Row row, Workbook wb) {
        for (Cell cell : row) {
            CellStyle existing = cell.getCellStyle();
            // chỉ set border nếu cell chưa có style border riêng
            if (existing.getBorderTop() == BorderStyle.NONE) {
                CellStyle style = wb.createCellStyle();
                style.cloneStyleFrom(existing);
                applyAllBorders(style, BorderStyle.THIN);
                cell.setCellStyle(style);
            }
        }
    }
}