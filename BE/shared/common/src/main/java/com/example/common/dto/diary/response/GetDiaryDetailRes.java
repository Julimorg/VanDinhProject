package com.example.common.dto.diary.response;

import com.example.persistence.enumTable.DiaryStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class GetDiaryDetailRes {


    private String id;

    private String diaryName;

    private DiaryStatus diaryStatus;

    private LocalDate diaryDate;

    private BigDecimal totalAmount;

    private BigDecimal totalQuantity;

    private String note;

    private String createdBy;

    private List<GetListItemsDiary> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
