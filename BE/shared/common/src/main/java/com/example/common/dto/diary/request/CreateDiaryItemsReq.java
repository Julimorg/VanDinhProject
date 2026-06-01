package com.example.common.dto.diary.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiaryItemsReq {

    private String id;

    @NotBlank(message = "Product Name Can Not Be Empty!")
    private String productName;

    @NotBlank(message = "Quantity Can Not Be Empty!")
    private int quantity;

    @NotBlank(message = "Price Can Not Be Empty!")
    private BigDecimal unitPrice;

    private String itemNote;

    private String color;

    private String volume;


}
