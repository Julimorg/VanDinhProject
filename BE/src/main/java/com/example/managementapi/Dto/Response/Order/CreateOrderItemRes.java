package com.example.managementapi.Dto.Response.Order;


import com.example.managementapi.Dto.Response.Product.ProductForCartItem;
import com.fasterxml.jackson.annotation.JsonFormat;
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
public class CreateOrderItemRes {
    private String orderItemId;

    private int quantity;

    private String productName;

    private List<String> productImage;

    private String productVolume;

    private String productUnit;

    private String productCode;

    private int productQuantity;

    private BigDecimal productPrice;

    private String colorName;

    private String categoryName;

    private LocalDateTime createAt;

}
