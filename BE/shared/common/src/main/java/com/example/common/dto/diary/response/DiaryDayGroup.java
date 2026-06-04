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
public class DiaryDayGroup {

    private LocalDateTime date;

    private int itemCount;

    private BigDecimal totalDay;

    private List<GetListItemsDiary> items;

}
