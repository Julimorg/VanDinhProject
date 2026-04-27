package com.example.common.dto.order.response;

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
public class UpdateOrderItemByAdminResponse {
    private String orderItemId;
    private int quantity;
    private BigDecimal price;
    private String productName;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
