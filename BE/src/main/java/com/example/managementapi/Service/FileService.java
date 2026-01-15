package com.example.managementapi.Service;

import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Component.MethodConverter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {

    private final MethodConverter methodConverter;

    private static final DateTimeFormatter DISPLAY_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generateExcelReport(List<Order> orders, String fromDateStr, String toDateStr) throws IOException {

        LocalDate fromDate = methodConverter.parseDate(fromDateStr);
        LocalDate toDate = methodConverter.parseDate(toDateStr);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("BaoCaoDonHang");

        //* === TẠO CÁC STYLE ===

        //? Title style
        Font titleFont = workbook.createFont();
        titleFont.setFontHeightInPoints((short) 26);
        titleFont.setBold(true);
        titleFont.setColor(IndexedColors.WHITE.getIndex());
        titleFont.setFontName("Arial");

        CellStyle titleStyle = workbook.createCellStyle();
        titleStyle.setFont(titleFont);
        titleStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        titleStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        titleStyle.setAlignment(HorizontalAlignment.CENTER);
        titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        //? Subtitle style
        Font subtitleFont = workbook.createFont();
        subtitleFont.setFontHeightInPoints((short) 11);
        subtitleFont.setItalic(true);
        subtitleFont.setColor(IndexedColors.GREY_80_PERCENT.getIndex());

        CellStyle subtitleStyle = workbook.createCellStyle();
        subtitleStyle.setFont(subtitleFont);
        subtitleStyle.setAlignment(HorizontalAlignment.CENTER);

        //? Header table style - Gradient effect
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerFont.setFontHeightInPoints((short) 11);

        CellStyle headerTableStyle = workbook.createCellStyle();
        headerTableStyle.setFont(headerFont);
        headerTableStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        headerTableStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerTableStyle.setAlignment(HorizontalAlignment.CENTER);
        headerTableStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        headerTableStyle.setBorderTop(BorderStyle.THIN);
        headerTableStyle.setBorderBottom(BorderStyle.MEDIUM);
        headerTableStyle.setBorderLeft(BorderStyle.THIN);
        headerTableStyle.setBorderRight(BorderStyle.THIN);

        //? Data cell style với borders
        CellStyle dataCellStyle = workbook.createCellStyle();
        dataCellStyle.setBorderTop(BorderStyle.THIN);
        dataCellStyle.setBorderBottom(BorderStyle.THIN);
        dataCellStyle.setBorderLeft(BorderStyle.THIN);
        dataCellStyle.setBorderRight(BorderStyle.THIN);
        dataCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        //? Money style
        CellStyle moneyStyle = workbook.createCellStyle();
        moneyStyle.cloneStyleFrom(dataCellStyle);
        moneyStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0\" ₫\""));
        moneyStyle.setAlignment(HorizontalAlignment.RIGHT);

        //? Date style
        CellStyle dateStyle = workbook.createCellStyle();
        dateStyle.cloneStyleFrom(dataCellStyle);
        dateStyle.setDataFormat(workbook.createDataFormat().getFormat("dd/MM/yyyy HH:mm"));
        dateStyle.setAlignment(HorizontalAlignment.CENTER);

        //? Wrap text style
        CellStyle wrapStyle = workbook.createCellStyle();
        wrapStyle.cloneStyleFrom(dataCellStyle);
        wrapStyle.setWrapText(true);
        wrapStyle.setVerticalAlignment(VerticalAlignment.TOP);

        //? Summary style - Bold với background vàng nhạt
        Font summaryFont = workbook.createFont();
        summaryFont.setBold(true);
        summaryFont.setFontHeightInPoints((short) 11);

        CellStyle summaryLabelStyle = workbook.createCellStyle();
        summaryLabelStyle.setFont(summaryFont);
        summaryLabelStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
        summaryLabelStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        summaryLabelStyle.setAlignment(HorizontalAlignment.RIGHT);
        summaryLabelStyle.setBorderTop(BorderStyle.THIN);
        summaryLabelStyle.setBorderBottom(BorderStyle.THIN);
        summaryLabelStyle.setBorderLeft(BorderStyle.THIN);
        summaryLabelStyle.setBorderRight(BorderStyle.THIN);

        CellStyle summaryValueStyle = workbook.createCellStyle();
        summaryValueStyle.setFont(summaryFont);
        summaryValueStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
        summaryValueStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        summaryValueStyle.setAlignment(HorizontalAlignment.CENTER);
        summaryValueStyle.setBorderTop(BorderStyle.THIN);
        summaryValueStyle.setBorderBottom(BorderStyle.THIN);
        summaryValueStyle.setBorderLeft(BorderStyle.THIN);
        summaryValueStyle.setBorderRight(BorderStyle.THIN);

        CellStyle summaryMoneyStyle = workbook.createCellStyle();
        summaryMoneyStyle.cloneStyleFrom(summaryValueStyle);
        summaryMoneyStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0\" ₫\""));
        summaryMoneyStyle.setAlignment(HorizontalAlignment.RIGHT);

        //? Total revenue style
        Font totalFont = workbook.createFont();
        totalFont.setBold(true);
        totalFont.setFontHeightInPoints((short) 13);
        totalFont.setColor(IndexedColors.DARK_RED.getIndex());

        CellStyle totalRevenueStyle = workbook.createCellStyle();
        totalRevenueStyle.cloneStyleFrom(summaryMoneyStyle);
        totalRevenueStyle.setFont(totalFont);
        totalRevenueStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());

        //* === HEADER CỬA HÀNG ===
        Row titleRow = sheet.createRow(1);
        titleRow.setHeightInPoints(35);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("VẠN ĐÌNH - BÁO CÁO ĐỖN HÀNG");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 11));

        Row periodRow = sheet.createRow(3);
        Cell periodCell = periodRow.createCell(0);
        periodCell.setCellValue("Từ ngày: " + fromDate.format(DISPLAY_FORMAT) +
                "  →  Đến ngày: " + toDate.format(DISPLAY_FORMAT));
        periodCell.setCellStyle(subtitleStyle);
        sheet.addMergedRegion(new CellRangeAddress(3, 3, 0, 11));

        //* === THỐNG KÊ ĐƠN HÀNG THEO NGÀY ===
        Map<LocalDate, Long> ordersByDate = orders.stream()
                .filter(o -> o.getCreateAt() != null)
                .collect(Collectors.groupingBy(
                        o -> o.getCreateAt().toLocalDate(),
                        Collectors.counting()
                ));

        int statRow = 5;
        Row statHeaderRow = sheet.createRow(statRow);
        Cell statHeaderCell = statHeaderRow.createCell(0);
        statHeaderCell.setCellValue("📊 THỐNG KÊ ĐƠN HÀNG THEO NGÀY");
        Font statHeaderFont = workbook.createFont();
        statHeaderFont.setBold(true);
        statHeaderFont.setFontHeightInPoints((short) 12);
        statHeaderFont.setColor(IndexedColors.DARK_BLUE.getIndex());
        CellStyle statHeaderStyle = workbook.createCellStyle();
        statHeaderStyle.setFont(statHeaderFont);
        statHeaderCell.setCellStyle(statHeaderStyle);
        sheet.addMergedRegion(new CellRangeAddress(statRow, statRow, 0, 11));

        statRow++;
        Row statColumnRow = sheet.createRow(statRow);
        String[] statColumns = {"Ngày", "Số đơn hàng"};
        for (int i = 0; i < statColumns.length; i++) {
            Cell cell = statColumnRow.createCell(i);
            cell.setCellValue(statColumns[i]);
            cell.setCellStyle(headerTableStyle);
        }

        statRow++;
        for (Map.Entry<LocalDate, Long> entry : ordersByDate.entrySet()) {
            Row dateStatRow = sheet.createRow(statRow++);

            Cell dateCell = dateStatRow.createCell(0);
            dateCell.setCellValue(entry.getKey().format(DISPLAY_FORMAT));
            dateCell.setCellStyle(dataCellStyle);

            Cell countCell = dateStatRow.createCell(1);
            countCell.setCellValue(entry.getValue());
            countCell.setCellStyle(dataCellStyle);
        }

        statRow += 2;

        //* === HEADER BẢNG DỮ LIỆU ===
        String[] columns = {"STT", "Mã đơn", "Ngày đặt", "Khách hàng", "SĐT", "Địa chỉ giao",
                "Chi tiết sản phẩm", "Tổng SL", "Thành tiền",
                "PT Thanh toán", "TT Thanh toán", "TT Đơn hàng"};

        Row headerRow = sheet.createRow(statRow);
        headerRow.setHeightInPoints(25);
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerTableStyle);
        }

        //* === ĐỔ DỮ LIỆU ĐƠN HÀNG ===
        int rowNum = statRow + 1;
        int stt = 1;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        int totalQtyAll = 0;

        for (Order order : orders) {
            Row dataRow = sheet.createRow(rowNum++);
            int itemCount = order.getOrderItems().size();
            dataRow.setHeightInPoints((float) (itemCount * 18 + 10));

            //? STT
            Cell sttCell = dataRow.createCell(0);
            sttCell.setCellValue(stt++);
            sttCell.setCellStyle(dataCellStyle);

            //? Mã đơn
            Cell codeCell = dataRow.createCell(1);
            codeCell.setCellValue(order.getOrderCode() != null ? order.getOrderCode() : order.getOrderId());
            codeCell.setCellStyle(dataCellStyle);

            //? Ngày đặt
            Cell dateCell = dataRow.createCell(2);
            if (order.getCreateAt() != null) {
                dateCell.setCellValue(order.getCreateAt());
                dateCell.setCellStyle(dateStyle);
            } else {
                dateCell.setCellStyle(dataCellStyle);
            }

            //? Khách hàng
            Cell customerCell = dataRow.createCell(3);
            String customerName = order.getUser() != null && order.getUser().getUserName() != null
                    ? order.getUser().getUserName() : "Khách lẻ";
            customerCell.setCellValue(customerName);
            customerCell.setCellStyle(dataCellStyle);

            //? SĐT
            Cell phoneCell = dataRow.createCell(4);
            String phone = order.getUser() != null && order.getUser().getPhone() != null
                    ? order.getUser().getPhone() : "";
            phoneCell.setCellValue(phone);
            phoneCell.setCellStyle(dataCellStyle);

            //? Địa chỉ
            Cell addressCell = dataRow.createCell(5);
            addressCell.setCellValue(order.getShipAddress() != null ? order.getShipAddress() : "");
            addressCell.setCellStyle(wrapStyle);

            //? Chi tiết sản phẩm
            StringBuilder itemsDetail = new StringBuilder();
            for (int i = 0; i < order.getOrderItems().size(); i++) {
                OrderItem item = order.getOrderItems().get(i);

                String productName = item.getProductName() != null
                        ? item.getProductName()
                        : "Sản phẩm không xác định";

                itemsDetail.append("• ").append(productName)
                        .append(" - ")
                        .append(item.getQuantity())
                        .append(" x ")
                        .append(String.format("%,d", item.getPrice().longValue()))
                        .append(" ₫");

                if (i < order.getOrderItems().size() - 1) {
                    itemsDetail.append("\n");
                }
            }
            Cell detailCell = dataRow.createCell(6);
            detailCell.setCellValue(itemsDetail.toString());
            detailCell.setCellStyle(wrapStyle);

            //? Tổng SL
            Cell qtyCell = dataRow.createCell(7);
            qtyCell.setCellValue(order.getTotal_quantity());
            qtyCell.setCellStyle(dataCellStyle);

            //? Thành tiền
            Cell amountCell = dataRow.createCell(8);
            amountCell.setCellValue(order.getOrderAmount().doubleValue());
            amountCell.setCellStyle(moneyStyle);

            //? Phương thức thanh toán
            Cell paymentMethodCell = dataRow.createCell(9);
            String paymentMethod = order.getPayment() != null && order.getPayment().getPaymentMethod() != null
                    ? order.getPayment().getPaymentMethod().name() : "Chưa TT";
            paymentMethodCell.setCellValue(paymentMethod);
            paymentMethodCell.setCellStyle(dataCellStyle);

            //? Trạng thái thanh toán
            Cell paymentStatusCell = dataRow.createCell(10);
            String paymentStatus = order.getPayment() != null && order.getPayment().getPaymentStatus() != null
                    ? order.getPayment().getPaymentStatus().name() : "";
            paymentStatusCell.setCellValue(paymentStatus);
            paymentStatusCell.setCellStyle(dataCellStyle);

            //? Trạng thái đơn
            Cell orderStatusCell = dataRow.createCell(11);
            orderStatusCell.setCellValue(order.getOrderStatus() != null ? order.getOrderStatus().name() : "");
            orderStatusCell.setCellStyle(dataCellStyle);

            totalRevenue = totalRevenue.add(order.getOrderAmount());
            totalQtyAll += order.getTotal_quantity();
        }

        //* === TỔNG HỢP CUỐI ===
        rowNum += 1;

        Row row1 = sheet.createRow(rowNum++);
        Cell label1 = row1.createCell(6);
        label1.setCellValue("Tổng số đơn hàng:");
        label1.setCellStyle(summaryLabelStyle);
        Cell value1 = row1.createCell(7);
        value1.setCellValue(orders.size());
        value1.setCellStyle(summaryValueStyle);

        Row row2 = sheet.createRow(rowNum++);
        Cell label2 = row2.createCell(6);
        label2.setCellValue("Tổng số lượng SP:");
        label2.setCellStyle(summaryLabelStyle);
        Cell value2 = row2.createCell(7);
        value2.setCellValue(totalQtyAll);
        value2.setCellStyle(summaryValueStyle);

        Row row3 = sheet.createRow(rowNum);
        Cell label3 = row3.createCell(6);
        label3.setCellValue("💰 TỔNG DOANH THU:");
        label3.setCellStyle(summaryLabelStyle);

        Cell value3 = row3.createCell(7);
        value3.setCellStyle(summaryLabelStyle);

        Cell totalCell = row3.createCell(8);
        totalCell.setCellValue(totalRevenue.doubleValue());
        totalCell.setCellStyle(totalRevenueStyle);

        //* === AUTO SIZE CỘT ===
        sheet.setColumnWidth(0, 256 * 6);   // STT
        sheet.setColumnWidth(1, 256 * 15);  // Mã đơn
        sheet.setColumnWidth(2, 256 * 18);  // Ngày đặt
        sheet.setColumnWidth(3, 256 * 20);  // Khách hàng
        sheet.setColumnWidth(4, 256 * 13);  // SĐT
        sheet.setColumnWidth(5, 256 * 30);  // Địa chỉ
        sheet.setColumnWidth(6, 256 * 50);  // Chi tiết SP
        sheet.setColumnWidth(7, 256 * 10);  // Tổng SL
        sheet.setColumnWidth(8, 256 * 15);  // Thành tiền
        sheet.setColumnWidth(9, 256 * 12);  // PT TT
        sheet.setColumnWidth(10, 256 * 12); // TT TT
        sheet.setColumnWidth(11, 256 * 13); // TT Đơn

        // Không freeze panes
        // sheet.createFreezePane(0, statRow + 1);

        //* === XUẤT FILE ===
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }
}