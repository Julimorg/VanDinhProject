package com.example.common.dto.diary.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateItemsReq {

    @NotBlank(message = "Product Name Can Not Be Empty!")
    private String productName;

    @Min(value = 1, message = "Quantity Must Be Greater Than 0!")
    private int quantity;

    @NotNull(message = "Price Can Not Be Empty!")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price Must Be Greater Than 0!")
    private BigDecimal unitPrice;

    private String itemNote;

    private String color;

    private String volume;


}
