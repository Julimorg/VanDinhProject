package com.example.common.dto.diary.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiaryItemsReq {

    @NotBlank(message = "Product Name Can Not Be Empty!")
    private String productName;

    @Min(value = 1, message = "Quantity Must Be Greater Than 0!")
    private int quantity;

    @NotNull(message = "Price Can Not Be Empty!")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price Must Be Greater Than 0!")
    private BigDecimal unitPrice;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate itemDate;

    private String itemNote;

    private String color;

    private String volume;


}
