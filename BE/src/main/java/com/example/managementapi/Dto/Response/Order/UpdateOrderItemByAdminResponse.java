package com.example.managementapi.Dto.Response.Order;

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
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
