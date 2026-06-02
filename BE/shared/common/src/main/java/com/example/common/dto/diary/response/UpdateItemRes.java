package com.example.common.dto.diary.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateItemRes {

    private String id;

    private String productId;

    private String productName;

    private int quantity;

    private String volume;

    private String color;

    private BigDecimal unitPrice;

    private String itemNote;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;
}
