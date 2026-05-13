package com.example.common.dto.product.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetProductSelectionRes {
    private String productId;
    private String productName;
    private int productQuantity;
    private BigDecimal productPrice;
    private String supplierName;

}
