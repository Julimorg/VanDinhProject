package com.example.managementapi.Dto.Request.Mail;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MailRequest {
    private String to;
    private String subject;
    private String body;
}
