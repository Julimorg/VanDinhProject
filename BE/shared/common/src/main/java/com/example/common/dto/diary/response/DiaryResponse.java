package com.example.common.dto.diary.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class DiaryResponse {

    private String id;
    private LocalDate diaryDate;
    private BigDecimal totalAmount;
    private String note;
    private String createdBy;
    private LocalDateTime createdAt;
    private List<DiaryItemResponse> items;
}
