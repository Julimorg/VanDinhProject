package com.example.managementapi.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailTemplateService {
    private final SpringTemplateEngine templateEngine;

    public String process(String templateName, Context context) {
        return templateEngine.process(templateName, context);
    }
}
