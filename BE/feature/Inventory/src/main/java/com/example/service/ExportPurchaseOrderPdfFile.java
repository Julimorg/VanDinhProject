package com.example.service;

import com.example.common.dto.inventory.response.GetPurchaseOrderDetailRes;
import com.example.common.util.VietnamCurrencyUtil;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.styledxmlparser.resolver.font.BasicFontProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import org.thymeleaf.context.Context;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportPurchaseOrderPdfFile {

    private final TemplateEngine templateEngine;

    public byte[] export(GetPurchaseOrderDetailRes order) {
        try {
            String html = templateEngine.process("PurchaseOrderTicket", buildContext(order));

            try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                ConverterProperties props = new ConverterProperties();

                // Setup font hỗ trợ tiếng Việt
                BasicFontProvider fontProvider = new BasicFontProvider(false, false);
                fontProvider.addFont("/fonts/DejaVuSans.ttf");
                fontProvider.addFont("/fonts/DejaVuSans-Bold.ttf");
                props.setFontProvider(fontProvider);

                HtmlConverter.convertToPdf(html, out, props);

                log.info("Xuất phiếu nhập kho: {}", order.getPoCode());
                return out.toByteArray();
            }
        } catch (Exception e) {
            log.error("Lỗi xuất PDF: ", e);
            throw new RuntimeException("Không thể xuất phiếu nhập kho: " + order.getPoCode(), e);
        }
    }

    private Context buildContext(GetPurchaseOrderDetailRes order) {
        Context ctx = new Context(new Locale("vi", "VN"));

        LocalDateTime date   = order.getOrderDate()    != null ? order.getOrderDate()    : order.getCreateAt();
        LocalDateTime kyDate = order.getReceivedDate() != null ? order.getReceivedDate() : LocalDateTime.now();

        ctx.setVariable("order",       order);
        ctx.setVariable("ngay",        date.getDayOfMonth());
        ctx.setVariable("thang",       date.getMonthValue());
        ctx.setVariable("nam",         date.getYear());
        ctx.setVariable("ngayKy",      kyDate.getDayOfMonth());
        ctx.setVariable("thangKy",     kyDate.getMonthValue());
        ctx.setVariable("namKy",       kyDate.getYear());
        ctx.setVariable("totalInWords", VietnamCurrencyUtil.toWords(order.getTotalPrice()));

        // Padding dòng trống (tối thiểu hiển thị 3 dòng)
        int itemSize  = order.getItems() != null ? order.getItems().size() : 0;
        ctx.setVariable("emptyRows", Math.max(0, 3 - itemSize));

        return ctx;
    }
}
