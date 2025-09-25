package com.example.managementapi.Dto.Response.Product;

import com.example.managementapi.Entity.Supplier;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRes {
    private String productId;
    private String productName;
    private String productDescription;
    private List<String> productImage;
    private String productVolume;
    private String productUnit;
    private String productCode;
    private int productQuantity;
    private double discount;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal productPrice;

    private String supplierName;
    private String colorName;
    private String categoryName;
}
