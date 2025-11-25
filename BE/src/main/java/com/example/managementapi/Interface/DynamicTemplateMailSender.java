package com.example.managementapi.Interface;

import java.util.Map;

public interface DynamicTemplateMailSender extends MailSenderStrategy{
    void sendDynamic(String to, String templateId, Map<String, Object> data) throws Exception;
}
