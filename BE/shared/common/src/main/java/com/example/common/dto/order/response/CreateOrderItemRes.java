package com.example.common.dto.order.response;
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

    private String productId;

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
