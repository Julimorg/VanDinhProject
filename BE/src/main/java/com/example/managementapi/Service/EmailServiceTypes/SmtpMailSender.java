package com.example.managementapi.Service.EmailServiceTypes;

import com.example.managementapi.Enum.MailProvider;
import com.example.managementapi.Interface.MailSenderStrategy;
import com.example.managementapi.Interface.MimeMessageMailSender;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class SmtpMailSender implements MimeMessageMailSender {
    private final JavaMailSender javaMailSender;

    @Override
    public void send(MimeMessage message) throws Exception {
        javaMailSender.send(message);
    }

    @Override
    public boolean supports(MailProvider provider) {
        return provider == MailProvider.SMTP;
    }
}
