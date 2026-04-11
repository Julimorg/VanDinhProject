package com.example.common.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Component
public class DateConverter {

    private static final DateTimeFormatter FORMATTER_YYYY_MM_DD = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter FORMATTER_DD_MM_YYYY = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            throw new IllegalArgumentException("Ngày không được để trống");
        }
        String trimmed = dateStr.trim();
        try {
            return LocalDate.parse(trimmed, FORMATTER_YYYY_MM_DD);
        } catch (DateTimeParseException e) {
            try {
                return LocalDate.parse(trimmed, FORMATTER_DD_MM_YYYY);
            } catch (DateTimeParseException ex) {
                throw new IllegalArgumentException(
                        "Định dạng ngày không hợp lệ: " + trimmed + ". Vui lòng dùng yyyy-MM-dd hoặc dd/MM/yyyy");
            }
        }
    }
}
