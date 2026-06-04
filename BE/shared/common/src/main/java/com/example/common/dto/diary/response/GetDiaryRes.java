package com.example.common.dto.diary.response;

import com.example.persistence.enumTable.DiaryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetDiaryRes {

    private String id;

    private String diaryName;

    private DiaryStatus diaryStatus;

    private BigDecimal totalAmount;

    private BigDecimal totalQuantity;

    private String note;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
