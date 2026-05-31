package com.example.common.dto.diary.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record DiaryItemRequest(
    String productId,

    @NotBlank String productName,

    @NotNull @DecimalMin("0.01") BigDecimal quantity,

    @NotNull @DecimalMin("0") BigDecimal unitPrice,

    String itemNote
) {}
