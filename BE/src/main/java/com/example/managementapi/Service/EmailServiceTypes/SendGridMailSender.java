package com.example.managementapi.Service.EmailServiceTypes;

import com.example.managementapi.Configuration.MailPropertiesConfiguration;
import com.example.managementapi.Enum.MailProvider;
import com.example.managementapi.Exception.MailSendException;
import com.example.managementapi.Interface.DynamicTemplateMailSender;
import com.example.managementapi.Interface.MailSenderStrategy;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import jakarta.mail.BodyPart;
import jakarta.mail.Multipart;
import jakarta.mail.Part;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SendGridMailSender implements DynamicTemplateMailSender {

    private final MailPropertiesConfiguration props;

    private String extractHtmlFromMimeMessage(MimeMessage mimeMessage) throws Exception {
        return getHtmlBody(mimeMessage.getContent());
    }

    private String getHtmlBody(Object content) throws Exception {
        if (content instanceof String) {
            return (String) content;
        }

        if (content instanceof Multipart multipart) {
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart part = multipart.getBodyPart(i);

                // Bỏ qua attachment
                if (Part.ATTACHMENT.equalsIgnoreCase(part.getDisposition())) {
                    continue;
                }

                // Nếu chính nó là text/html → trả về luôn
                if (part.isMimeType("text/html")) {
                    Object partContent = part.getContent();
                    if (partContent instanceof String) {
                        return (String) partContent;
                    }
                }

                // Nếu là multipart (nested) → đệ quy tìm tiếp
                if (part.getContent() instanceof Multipart) {
                    String found = getHtmlBody(part.getContent());
                    if (found != null) {
                        return found;
                    }
                }

                // Nếu là text/plain → dùng làm fallback
                if (part.isMimeType("text/plain")) {
                    Object plain = part.getContent();
                    if (plain instanceof String) {
                        return "<pre>" + plain + "</pre>";
                    }
                }
            }
        }

        return null;
    }


    @Override
    public void sendDynamic(String to, String templateId, Map<String, Object> data) throws Exception {
        try {
            Email from = new Email(props.getFromEmail(), props.getFromName());
            Email toEmail = new Email(to);

            Mail mail = new Mail();
            mail.setFrom(from);
            mail.setTemplateId(templateId);

            Personalization personalization = new Personalization();
            personalization.addTo(toEmail);
            data.forEach(personalization::addDynamicTemplateData);
            mail.addPersonalization(personalization);

            SendGrid sg = new SendGrid(props.getSendgrid().getApiKey());
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            if (response.getStatusCode() != 202) {
                throw new RuntimeException("SendGrid Dynamic Template lỗi: " + response.getBody());
            }
        } catch (IOException e) {
            throw new MailSendException("SendGrid gửi thất bại", e);
        }
    }

    @Override
    public boolean supports(MailProvider provider) {
        return provider == MailProvider.SENDGRID;
    }
}
