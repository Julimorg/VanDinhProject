package com.example.common.dto.diary.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiaryItemsRes {

    private String id;

    private String diaryName;

    private BigDecimal totalQuantity;

    private BigDecimal totalAmount;

    private List<ListItemInUserDiaryAfterCreate> items;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;
}
