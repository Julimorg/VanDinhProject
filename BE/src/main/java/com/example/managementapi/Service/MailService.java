package com.example.managementapi.Service;


import com.example.managementapi.Configuration.MailPropertiesConfiguration;
import com.example.managementapi.Dto.Email.MailBody;
import com.example.managementapi.Dto.Response.Order.UpdateOrderByUserRes;
import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Enum.MailProvider;
import com.example.managementapi.Exception.MailSendException;
import com.example.managementapi.Util.MailStrategyFactory;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MailService {

    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender javaMailSender;
    private final MailPropertiesConfiguration mailProperties;
    private final MailStrategyFactory strategyFactory;

    private static String FROM_EMAIL;

    @Value("${mail.from-email}")
    private String defaultFromEmail(String fromEmail){
        return MailService.FROM_EMAIL = fromEmail;
    }

    private void sendViaProvider(MimeMessage message) {
        try {
            MailProvider provider = MailProvider.valueOf(mailProperties.getProvider().toUpperCase());
            strategyFactory.getStrategy(provider).send(message);
        } catch (Exception e) {
            throw new MailSendException("Send email failed with provider: " + mailProperties.getProvider(), e);
        }
    }

    //? Load template từ resources
    public String loadTemplate(String fileName) throws Exception {
        ClassPathResource resource = new ClassPathResource(fileName);
        try (InputStream inputStream = resource.getInputStream()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }


    //? Send OTP
    @Async
    public void sendOtpEmail(MailBody mailBody, int otp) throws Exception {
        String htmlContent = loadTemplate("templates/sendEmailForm.html");
        htmlContent = htmlContent.replace("{{otp}}", String.valueOf(otp));
        htmlContent = htmlContent.replace("{{email}}", mailBody.to());

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(mailBody.to());
        helper.setFrom(mailProperties.getFromEmail());
        helper.setSubject(mailBody.subject());
        helper.setText(htmlContent, true);

        sendViaProvider(message);
    }

    //? Send Order From User To Admin
    @Async
    public void sendOrderNotificationToAdmin(String adminEmail,
                                             UpdateOrderByUserRes order,
                                             String storeName,
                                             String orderManagementUrl,
                                             String adminName,
                                             String processingDeadline) {
        try {
            Context context = new Context();
            context.setVariable("adminName", adminName);
            context.setVariable("order", order);
            context.setVariable("storeName", storeName);
            context.setVariable("orderManagementUrl", orderManagementUrl);
            context.setVariable("processingDeadline", processingDeadline);

            String htmlContent = templateEngine.process("SendEmailToAdminToHandleCartForUser", context);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(adminEmail);
            helper.setFrom(mailProperties.getFromEmail());
            helper.setSubject("Thông Báo Đơn Hàng Mới Cần Xử Lý - " + order.getOrderCode());
            helper.setText(htmlContent, true);

            sendViaProvider(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi email: " + e.getMessage(), e);
        }
    }

    public void populateContext(Context context, UpdateOrderByUserRes orderResponse) {
        context.setVariable("orderCode", orderResponse.getOrderCode());
        context.setVariable("createAt", orderResponse.getCreateAt().toString());
        context.setVariable("status", orderResponse.getStatus().toString());
        context.setVariable("amount", orderResponse.getAmount());
        context.setVariable("paymentMethod", orderResponse.getPaymentMethod());
        context.setVariable("paymentStatus", orderResponse.getPaymentStatus());
        context.setVariable("email", orderResponse.getEmail());
        context.setVariable("phone", orderResponse.getPhone());
        context.setVariable("userAddress", orderResponse.getUserAddress());
        context.setVariable("shipAddress", orderResponse.getShipAddress());
        context.setVariable("items", orderResponse.getOrderItems());
        context.setVariable("completeAt", orderResponse.getCompleteAt() != null ? orderResponse.getCompleteAt().toString() : null);
        context.setVariable("company_name", "Công Ty ABC");
        context.setVariable("support_email", "support@abc.com");
        context.setVariable("support_phone", "0123 456 789");
        context.setVariable("company_website", "www.abc.com");
    }

    //? Send Order has been approved by Admin
    @Async
    public void sendOrderApprovedEmail(UpdateOrderByUserRes orderResponse) throws MessagingException {
        Context context = new Context();
        populateContext(context, orderResponse);

        String emailContent = templateEngine.process("SendEmailOrderSuccessfullyForm", context);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(orderResponse.getEmail());
        helper.setFrom(mailProperties.getFromEmail());
        helper.setSubject("Thông báo đơn hàng được phê duyệt #" + orderResponse.getOrderCode());
        helper.setText(emailContent, true);

        sendViaProvider(message);
    }

    //? Send Order Status: Canceled by Admin
    @Async
    public void sendOrderCanceledEmail(UpdateOrderByUserRes orderResponse) throws MessagingException {
        Context context = new Context();
        populateContext(context, orderResponse);

        String emailContent = templateEngine.process("SendEmailOrderCanceled", context);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(orderResponse.getEmail());
        helper.setFrom(mailProperties.getFromEmail());
        helper.setSubject("Thông báo hủy đơn hàng #" + orderResponse.getOrderCode());
        helper.setText(emailContent, true);

        sendViaProvider(message);
    }

    @Async
    public void sendOrderCreatedByAdminEmail(
            String to, String customerName,
            String orderCode, LocalDateTime createAt, String status,
            BigDecimal amount, List<OrderItem> orderItems,
            String companyName, String supportEmail, String hotline, String website
    ) throws MessagingException {

        Context context = new Context();
        context.setVariable("customerName", customerName);
        context.setVariable("orderCode", orderCode);
        context.setVariable("createAt", createAt);
        context.setVariable("status", status);
        context.setVariable("amount", amount);
        context.setVariable("orderItems", orderItems);
        context.setVariable("companyName", companyName);
        context.setVariable("supportEmail", supportEmail);
        context.setVariable("hotline", hotline);
        context.setVariable("website", website);

        String htmlContent = templateEngine.process("SendMailOrderCreatedByAdminToUser", context);

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setFrom(mailProperties.getFromEmail());
        helper.setSubject("Xác nhận đơn hàng #" + orderCode);
        helper.setText(htmlContent, true);

        sendViaProvider(message);
    }

    //? Send Email Check Quantity for Admin
    @Async
    public void sendLowStockEmail(String to, Product product) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        context.setVariable("product", product);
        context.setVariable("message", "Vui lòng kiểm tra và bổ sung hàng hóa ngay lập tức.");

        String htmlContent = templateEngine.process("SendEmailProductChecker", context);

        helper.setTo(to);
        helper.setSubject("Cảnh Báo: Sản Phẩm " + product.getProductName() + " Sắp Hết Hàng");
        helper.setText(htmlContent, true);
        helper.setFrom(mailProperties.getFromEmail());

        sendViaProvider(message);
    }

}
