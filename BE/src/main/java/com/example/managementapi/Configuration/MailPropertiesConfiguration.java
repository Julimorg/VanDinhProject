package com.example.managementapi.Configuration;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "mail")
public class MailPropertiesConfiguration {

    @Value("${mail.provider}")
    private String provider;

    @Value("${mail.from-email}")
    private String fromEmail;

    @Value("${mail.provider}")
    private String fromName;


    @PostConstruct
    public void init() {
        System.out.println(">>> MAIL_PROVIDER = " + provider);
        System.out.println(">>> FROM_EMAIL = " + fromEmail);
        System.out.println(">>> SENDGRID_API_KEY = " + (sendgrid != null ? sendgrid.getApiKey() : "NULL"));
        System.out.println(">>> MAILGUN_API_KEY = " + (mailgun != null ? mailgun.getApiKey() : "NULL"));
    }
    private final Sendgrid sendgrid = new Sendgrid();
    private final Mailgun mailgun = new Mailgun();

    @Getter
    @Setter
    public static class Sendgrid {
        private String apiKey;
    }

    @Getter
    @Setter
    public static class Mailgun {
        private String apiKey;
        private String domain;
    }
}
