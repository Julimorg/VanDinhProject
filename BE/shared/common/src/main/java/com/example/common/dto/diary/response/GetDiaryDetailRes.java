package com.example.common.dto.diary.response;

import com.example.persistence.enumTable.DiaryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetDiaryDetailRes {


    private String id;

    private String diaryName;

    private DiaryStatus diaryStatus;

    private BigDecimal totalAmount;

    private BigDecimal totalQuantity;

    private String note;

    private String createdBy;

    private List<DiaryDayGroup> days;

    private LocalDateTime createdAt;

    private LocalDateTime updateAt;

}
