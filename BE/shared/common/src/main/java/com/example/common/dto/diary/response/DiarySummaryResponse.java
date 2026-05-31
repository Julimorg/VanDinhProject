package com.example.common.dto.diary.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DiarySummaryResponse(
    String id,
    LocalDate diaryDate,
    BigDecimal totalAmount,
    String note,
    String createdBy,
    LocalDateTime createdAt
) {}
