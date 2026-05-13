package com.example.messaging.service;

import com.example.common.dto.order.response.UpdateOrderByUserRes;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;
import java.time.Year;
import java.util.HashMap;
import java.util.Map;

import static jakarta.mail.Transport.send;

@Service
@Slf4j
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOtpEmail(String toEmail, int otp) {
        send(
                toEmail,
                "OTP xác nhận - Quên mật khẩu",
                "mail/sendEmailForm",
                Map.of(
                        "otp",   otp,
                        "email", toEmail,
                        "year",  Year.now().getValue()
                )
        );
    }

    // ----------------------------------------------------------------
    // Order emails
    // ----------------------------------------------------------------

    @Async
    public void sendConfirmOrderByUser(String adminEmail,
                                             UpdateOrderByUserRes order,
                                             String storeName,
                                             String orderManagementUrl,
                                             String adminName,
                                             String processingDeadline) {
        send(
                adminEmail,
                "Thông Báo Đơn Hàng Mới Cần Xử Lý - " + order.getOrderCode(),
                "SendEmailToAdminToHandleCartForUser",
                Map.of(
                        "adminName",          adminName,
                        "order",              order,
                        "storeName",          storeName,
                        "orderManagementUrl", orderManagementUrl,
                        "processingDeadline", processingDeadline
                )
        );
    }


    @Async
    public void sendOrderApprovedEmail(UpdateOrderByUserRes order) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("orderId",       order.getOrderId());
        variables.put("orderCode",     order.getOrderCode());
        variables.put("email",         order.getEmail());
        variables.put("phone",         order.getPhone());
        variables.put("userAddress",   order.getUserAddress());
        variables.put("shipAddress",   order.getShipAddress());
        variables.put("status",        order.getStatus());
        variables.put("amount",        order.getAmount());
        variables.put("paymentMethod", order.getPaymentMethod());
        variables.put("paymentStatus", order.getPaymentStatus());
        variables.put("orderItems",    order.getOrderItems());
        variables.put("createAt",      order.getCreateAt());
        variables.put("completeAt",    order.getCompleteAt());

        send(
                order.getEmail(),
                "Thông báo đơn hàng được phê duyệt #" + order.getOrderCode(),
                "SendEmailOrderSuccessfullyForm",
                variables
        );
    }

    @Async
    public void sendOrderCanceledEmail(UpdateOrderByUserRes order) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("orderId",       order.getOrderId());
        variables.put("orderCode",     order.getOrderCode());
        variables.put("email",         order.getEmail());
        variables.put("phone",         order.getPhone());
        variables.put("userAddress",   order.getUserAddress());
        variables.put("shipAddress",   order.getShipAddress());
        variables.put("status",        order.getStatus());
        variables.put("amount",        order.getAmount());
        variables.put("paymentMethod", order.getPaymentMethod());
        variables.put("paymentStatus", order.getPaymentStatus());
        variables.put("orderItems",    order.getOrderItems());
        variables.put("createAt",      order.getCreateAt());
        variables.put("completeAt",    order.getCompleteAt());

        send(
                order.getEmail(),
                "Thông báo hủy đơn hàng #" + order.getOrderCode(),
                "SendEmailOrderCanceled",
                variables
        );
    }
//
//    @Async
//    public void sendOrderCreatedByAdminEmail(OrderMailDto order) {
//        send(
//                order.email(),
//                "Xác nhận đơn hàng #" + order.orderCode(),
//                "mail/order-created-by-admin",
//                buildOrderVariables(order)
//        );
//    }
//
//    @Async
//    public void sendNewOrderNotificationToAdmin(String adminEmail, OrderMailDto order) {
//        send(
//                adminEmail,
//                "Đơn hàng mới cần xử lý - #" + order.orderCode(),
//                "mail/order-notify-admin",
//                Map.of("order", order)
//        );
//    }
//
//    // ----------------------------------------------------------------
//    // Low stock alert
//    // ----------------------------------------------------------------
//
//    @Async
//    public void sendLowStockAlert(String adminEmail, Product product) {
//        send(
//                adminEmail,
//                "Cảnh báo: " + product.getProductName() + " sắp hết hàng",
//                "mail/low-stock-alert",
//                Map.of("product", product)
//        );
//    }


    /**
     *
     * @param to           địa chỉ nhận
     * @param subject      tiêu đề
     * @param templateName tên template (ví dụ: "mail/otp" → resources/templates/mail/otp.html)
     * @param variables    biến truyền vào template
     */
    private void send(String to,
                      String subject,
                      String templateName,
                      Map<String, Object> variables) {
        try {
            String html = render(templateName, variables);

            MimeMessage  message = mailSender.createMimeMessage();
            MimeMessageHelper  helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setFrom(fromEmail);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);
            log.debug("Email '{}' gửi thành công đến {}", templateName, to);

        } catch (MessagingException e) {
            log.error("Gửi email '{}' thất bại đến {}: {}", templateName, to, e.getMessage());
            throw new RuntimeException("Gửi email thất bại: " + subject, e);
        }
    }

    private String render(String templateName, Map<String, Object> variables) {
        Context context = new Context();
        variables.forEach(context::setVariable);
        return templateEngine.process(templateName, context);
    }

//    // ----------------------------------------------------------------
//    // Helper — build variables chung cho order emails
//    // ----------------------------------------------------------------
//
//    private Map<String, Object> buildOrderVariables(OrderMailDto order) {
//        return Map.of(
//                "order",          order,
//                "company_name",   "VanDinhStore",
//                "support_email",  "support@vandinhstore.com",
//                "support_phone",  "0123 456 789",
//                "company_website","www.vandinhstore.com"
//        );
//    }

}
