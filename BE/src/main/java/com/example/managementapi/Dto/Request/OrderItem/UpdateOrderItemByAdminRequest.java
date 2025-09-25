package com.example.managementapi.Dto.Request.OrderItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderItemByAdminRequest {
    private String orderItemId;
    private String productId;
    private int quantity;

}
