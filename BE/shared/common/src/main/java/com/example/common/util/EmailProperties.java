package com.example.common.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "app.mail")
@Component
@Getter
@Setter
public class EmailProperties {

    private String adminEmail;

    private String storeName;

    private String orderManagementUrl;

    private String adminName;

    private String processingDeadline;

}
