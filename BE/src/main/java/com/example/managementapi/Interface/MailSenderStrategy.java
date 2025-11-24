package com.example.managementapi.Interface;

import com.example.managementapi.Enum.MailProvider;
import jakarta.mail.internet.MimeMessage;

public interface MailSenderStrategy {
    void send(MimeMessage message) throws Exception;
    boolean supports(MailProvider provider);
}
