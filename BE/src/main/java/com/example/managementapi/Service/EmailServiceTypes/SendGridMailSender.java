package com.example.managementapi.Service.EmailServiceTypes;

import com.example.managementapi.Configuration.MailPropertiesConfiguration;
import com.example.managementapi.Enum.MailProvider;
import com.example.managementapi.Exception.MailSendException;
import com.example.managementapi.Interface.MailSenderStrategy;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class SendGridMailSender implements MailSenderStrategy {

    private final MailPropertiesConfiguration props;

    @Override
    public void send(MimeMessage message) throws Exception {
        try {
            String htmlContent = getHtmlContent(message);

            String to = message.getAllRecipients()[0].toString();
            String subject = message.getSubject() != null ? message.getSubject() : "";

            Email from = new Email(props.getFromEmail(), props.getFromName());
            Email toEmail = new Email(to);
            Content content = new Content("text/html", htmlContent);

            Mail mail = new Mail(from, subject, toEmail, content);
            SendGrid sg = new SendGrid(props.getSendgrid().getApiKey());

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            if (response.getStatusCode() >= 400) {
                throw new MailSendException("Sengrid Error: " + response.getBody(), null);
            }
        } catch (IOException e) {
            throw new MailSendException("SendGrid gửi thất bại", e);
        }
    }

    private String getHtmlContent(MimeMessage mimeMessage) throws Exception {
        Object content = mimeMessage.getContent();
        if (content instanceof String) {
            return (String) content;
        } else if (content instanceof MimeMultipart multipart) {
            for (int i = 0; i < multipart.getCount(); i++) {
                var bodyPart = multipart.getBodyPart(i);
                if (bodyPart.getContentType().contains("text/html")) {
                    return bodyPart.getContent().toString();
                }
            }
        }
        return "<p>Email nội dung không hỗ trợ</p>";
    }

    @Override
    public boolean supports(MailProvider provider) {

        return provider == MailProvider.SENDGRID;
    }
}
