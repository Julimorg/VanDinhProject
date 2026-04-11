package com.example.com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@EnableAsync
@SpringBootApplication(scanBasePackages = "com.example")
@ConfigurationPropertiesScan

public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
