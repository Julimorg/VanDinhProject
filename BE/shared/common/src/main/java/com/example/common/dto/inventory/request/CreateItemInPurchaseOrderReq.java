package com.example.common.dto.inventory.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateItemInPurchaseOrderReq {

    @NotBlank(message = "Product Name can not be empty!")
    private String productName;

    private String productCode;

    private String productVolume;

    private String colorName;

    private String supplierName;

    private int quantityOrdered;

    private BigDecimal costPrice;

    private LocalDateTime expiryDate;

    private String note;

}
