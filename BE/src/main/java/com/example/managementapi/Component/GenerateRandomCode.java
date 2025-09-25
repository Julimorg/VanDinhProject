package com.example.managementapi.Component;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
public class GenerateRandomCode {
    private static final Random RANDOM = new Random();
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    public String generateOrderCode() {
        String prefix = "ORD-";
        String date = LocalDate.now().format(DATE_FORMATTER);
        int randomNumber = 1000 + RANDOM.nextInt(9000);

        return prefix + date + "-" + randomNumber;
    }
}
