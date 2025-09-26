package com.example.managementapi.Dto.Response.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRes {
    private String productId;
    private String productName;
    private String productDescription;
    private List<String> productImage;
    private String productVolume;
    private String productUnit;
    private String productCode;
    private int productQuantity;
    private double discount;
    private BigDecimal productPrice;
    private String supplierName;
    private String colorName;
    private String categoryName;
    private LocalDateTime createAt;
}
