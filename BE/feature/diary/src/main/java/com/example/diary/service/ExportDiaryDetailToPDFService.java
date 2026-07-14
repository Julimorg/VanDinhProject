package com.example.diary.service;

import com.example.common.dto.diary.response.DiaryDayGroup;
import com.example.common.dto.diary.response.GetDiaryDetailRes;
import com.example.common.dto.diary.response.GetListItemsDiary;
import com.example.common.interfaces.diary.DiaryService;
import com.example.common.interfaces.user.UserInternalService;
import com.example.common.util.VietnamCurrencyUtil;
import com.example.persistence.entity.User;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.styledxmlparser.resolver.font.BasicFontProvider;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportDiaryDetailToPDFService {

    private final TemplateEngine templateEngine;

    private final DiaryService diaryService;

    private final UserInternalService userInternalService;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // ==== Thông tin cửa hàng — config trực tiếp tại đây ====
    private static final String STORE_NAME      = "VẠN DINH";
    private static final String STORE_ADDRESS   = "123 Đường ABC, Quận 1, TP.HCM";
    private static final String STORE_PHONE     = "0123 456 789";
    private static final String STORE_TAX_CODE  = "0123456789";
    private static final String BANK_ACCOUNT    = "0123456789";
    private static final String BANK_NAME       = "Vietcombank - CN TP.HCM";

    @Getter
    @Builder
    public static class InvoiceRow {
        private int stt;
        private String date;
        private String productName;
        private String volume;
        private String color;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
    }

    public byte[] exportInvoice( String diaryId) {

        GetDiaryDetailRes diary = diaryService.getDiaryDetail(diaryId);
//        User customer = userInternalService.getUserById(userId);
        List<InvoiceRow> rows = buildRows(diary.getDays());

        try {
            String html = templateEngine.process("DiaryInvoiceTicket", buildContext(diary, rows));

            try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                ConverterProperties props = new ConverterProperties();

                BasicFontProvider fontProvider = new BasicFontProvider(false, false);
                fontProvider.addFont("/fonts/DejaVuSans.ttf");
                fontProvider.addFont("/fonts/DejaVuSans-Bold.ttf");
                props.setFontProvider(fontProvider);

                HtmlConverter.convertToPdf(html, out, props);

                log.info("Xuất hóa đơn diary: {}", diary.getDiaryCode());
                return out.toByteArray();
            }
        } catch (Exception e) {
            log.error("Lỗi xuất PDF hóa đơn diary: ", e);
            throw new RuntimeException("Không thể xuất hóa đơn: " + diaryId, e);
        }
    }

    private List<InvoiceRow> buildRows(List<DiaryDayGroup> days) {
        List<InvoiceRow> rows = new ArrayList<>();
        if (days == null) return rows;

        int stt = 1;
        for (DiaryDayGroup day : days) {
            String date = day.getDate() != null ? day.getDate().format(DATE_FORMAT) : "";
            for (GetListItemsDiary item : day.getItems()) {
                BigDecimal lineTotal = item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity()));
                rows.add(InvoiceRow.builder()
                        .stt(stt++)
                        .date(date)
                        .productName(item.getProductName())
                        .volume(item.getVolume())
                        .color(item.getColor())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .lineTotal(lineTotal)
                        .build());
            }
        }
        return rows;
    }

    private Context buildContext(GetDiaryDetailRes diary, List<InvoiceRow> rows) {
        Context ctx = new Context(new Locale("vi", "VN"));

        ctx.setVariable("storeName", STORE_NAME);
        ctx.setVariable("storeAddress", STORE_ADDRESS);
        ctx.setVariable("storePhone", STORE_PHONE);
        ctx.setVariable("storeTaxCode", STORE_TAX_CODE);
        ctx.setVariable("bankAccount", BANK_ACCOUNT);
        ctx.setVariable("bankName", BANK_NAME);

        ctx.setVariable("diary", diary);
        ctx.setVariable("diaryDate", diary.getCreatedAt() != null
                ? diary.getCreatedAt().format(DATE_FORMAT) : "");

//        ctx.setVariable("customerName", customer.getUserName());
//        ctx.setVariable("customerPhone", customer.getPhone());
//        ctx.setVariable("customerAddress", customer.getUserAddress());

        ctx.setVariable("rows", rows);
        ctx.setVariable("totalAmount", diary.getTotalAmount());
        ctx.setVariable("totalInWords", VietnamCurrencyUtil.toWords(diary.getTotalAmount()));

        return ctx;
    }
}