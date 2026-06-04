package com.example.diary.service;

import com.example.common.dto.diary.response.DiaryDayGroup;
import com.example.common.dto.diary.response.GetDiaryDetailRes;
import com.example.common.dto.diary.response.GetListItemsDiary;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.user.UserInternalService;
import com.example.diary.repository.UserDiaryItemRepository;
import com.example.diary.repository.UserDiaryRepository;
import com.example.diary.mapper.DiaryMapper;
import com.example.persistence.entity.User;
import com.example.persistence.entity.UserDiary;
import com.example.persistence.entity.UserDiaryItem;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExportDiaryDetailToFileService {

    private final UserDiaryRepository     diaryRepository;
    private final UserDiaryItemRepository itemRepository;
    private final DiaryMapper             mapper;
    private final UserInternalService     userService;

    private static final String FONT_NAME = "Times New Roman";

    // ══════════════════════════════════════════════════════════════════════
    // PUBLIC — entry point
    // ══════════════════════════════════════════════════════════════════════

    @Transactional
    public byte[] exportDiaryDetailToExcelFile(String userId, String diaryId) {

        User customer = userService.getUserById(userId);

        UserDiary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new AppException(ErrorCode.DIARY_NOT_FOUND));

        // fetch items và group by date — không gọi DiaryServiceImpl tránh circular
        List<UserDiaryItem> items = itemRepository.findByDiaryIdOrderByItemDateAsc(diaryId);

        List<DiaryDayGroup> days = items.stream()
                .collect(Collectors.groupingBy(
                        i -> i.getItemDate().toLocalDate(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ))
                .entrySet().stream()
                .map(entry -> {
                    List<GetListItemsDiary> mapped = entry.getValue()
                            .stream().map(mapper::toGetListItemsDiary).toList();
                    BigDecimal totalDay = mapped.stream()
                            .map(GetListItemsDiary::getUnitPrice)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return DiaryDayGroup.builder()
                            .date(entry.getKey())
                            .itemCount(mapped.size())
                            .totalDay(totalDay)
                            .items(mapped)
                            .build();
                })
                .toList();

        return buildExcel(customer, diary, days);
    }

    // ══════════════════════════════════════════════════════════════════════
    // PRIVATE — build Excel
    // ══════════════════════════════════════════════════════════════════════

    private byte[] buildExcel(User customer, UserDiary diary, List<DiaryDayGroup> days) {

        try (Workbook wb = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = wb.createSheet("Phiếu mua hàng");

            // ── Pre-build styles ─────────────────────────────────────────
            CellStyle titleStyle      = createTitleStyle(wb);
            CellStyle subTitleStyle   = createSubTitleStyle(wb);
            CellStyle headerStyle     = createHeaderStyle(wb);
            CellStyle dataStyle       = createDataStyle(wb);
            CellStyle centerStyle     = createDateCenterStyle(wb);
            CellStyle moneyStyle      = createMoneyStyle(wb);
            CellStyle totalStyle      = createTotalStyle(wb);
            CellStyle totalMoneyStyle = createTotalMoneyStyle(wb);

            // ── Row 0: Tên cửa hàng ──────────────────────────────────────
            Row r0 = sheet.createRow(0);
            r0.setHeightInPoints(28);
            Cell storeCell = r0.createCell(0);
            storeCell.setCellValue("VAN DINH STORE");
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

            // ── Row 3: Tên phiếu ─────────────────────────────────────────
            Row r3 = sheet.createRow(3);
            r3.setHeightInPoints(18);
            Cell diaryNameCell = r3.createCell(0);
            diaryNameCell.setCellValue("Phiếu: " + diary.getDiaryName());
            diaryNameCell.setCellStyle(dataStyle);
            sheet.addMergedRegion(new CellRangeAddress(3, 3, 0, 6));

            // ── Row 4: spacer ─────────────────────────────────────────────
            sheet.createRow(4).setHeightInPoints(6);

            // ── Row 5: Header bảng ────────────────────────────────────────
            Row headerRow = sheet.createRow(5);
            headerRow.setHeightInPoints(28);
            String[] cols = {"Ngày", "Tên hàng", "ĐVT", "Màu sắc", "Số lượng", "Đơn giá", "Thành tiền"};
            for (int i = 0; i < cols.length; i++) {
                Cell c = headerRow.createCell(i);
                c.setCellValue(cols[i]);
                c.setCellStyle(headerStyle);
            }

            // ── Data rows (bắt đầu từ row index 6 = Excel row 7) ─────────
            int rowIdx = 6;

            for (DiaryDayGroup day : days) {
                boolean firstOfDay = true;

                for (GetListItemsDiary item : day.getItems()) {
                    Row row = sheet.createRow(rowIdx);
                    row.setHeightInPoints(18);

                    // Cột A (0) — Ngày: chỉ in dòng đầu tiên của ngày
                    Cell dateCell = row.createCell(0);
                    if (firstOfDay) {
                        dateCell.setCellValue(
                                day.getDate().format(DateTimeFormatter.ofPattern("d/M/yyyy"))
                        );
                        firstOfDay = false;
                    }
                    dateCell.setCellStyle(centerStyle);

                    // Cột B (1) — Tên hàng
                    Cell nameCell = row.createCell(1);
                    nameCell.setCellValue(item.getProductName() != null ? item.getProductName() : "");
                    nameCell.setCellStyle(dataStyle);

                    // Cột C (2) — ĐVT
                    Cell dvtCell = row.createCell(2);
                    dvtCell.setCellValue(item.getVolume() != null ? item.getVolume() : "");
                    dvtCell.setCellStyle(centerStyle);

                    // Cột D (3) — Màu sắc
                    Cell colorCell = row.createCell(3);
                    colorCell.setCellValue(item.getColor() != null ? item.getColor() : "");
                    colorCell.setCellStyle(centerStyle);

                    // Cột E (4) — Số lượng
                    Cell qtyCell = row.createCell(4);
                    qtyCell.setCellValue(item.getQuantity());
                    qtyCell.setCellStyle(centerStyle);

                    // Cột F (5) — Đơn giá
                    Cell priceCell = row.createCell(5);
                    priceCell.setCellValue(item.getUnitPrice().doubleValue());
                    priceCell.setCellStyle(moneyStyle);

                    // Cột G (6) — Thành tiền = E * F
                    Cell subtotalCell = row.createCell(6);
                    subtotalCell.setCellFormula("E" + (rowIdx + 1) + "*F" + (rowIdx + 1));
                    subtotalCell.setCellStyle(moneyStyle);

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

            // fill các ô merged để border hiển thị đều
            for (int col = 1; col <= 5; col++) {
                totalRow.createCell(col).setCellStyle(totalStyle);
            }

            // SUM từ data row đầu tiên (7) đến row cuối cùng
            Cell totalValue = totalRow.createCell(6);
            totalValue.setCellFormula("SUM(G7:G" + rowIdx + ")");
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
    // HELPERS
    // ══════════════════════════════════════════════════════════════════════

    private void applyAllBorders(CellStyle style, BorderStyle borderStyle) {
        style.setBorderTop(borderStyle);
        style.setBorderBottom(borderStyle);
        style.setBorderLeft(borderStyle);
        style.setBorderRight(borderStyle);
    }
}