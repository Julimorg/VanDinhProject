package com.example.common.dto.diary.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.persistence.enumTable.DiaryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiaryRes {

    private String id;

    private String diaryName;

    private DiaryStatus diaryStatus;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private BigDecimal totalAmount;

    private BigDecimal totalQuantity;

    private String note;

    private String createdBy;

    private LocalDateTime createdAt;


}
