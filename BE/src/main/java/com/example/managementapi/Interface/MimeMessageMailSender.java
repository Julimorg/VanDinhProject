package com.example.managementapi.Interface;

import jakarta.mail.internet.MimeMessage;

public interface MimeMessageMailSender extends MailSenderStrategy{
    void send(MimeMessage message) throws Exception;
}
