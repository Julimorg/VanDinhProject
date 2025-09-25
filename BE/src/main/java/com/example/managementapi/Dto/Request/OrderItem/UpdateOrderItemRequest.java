package com.example.managementapi.Dto.Request.OrderItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderItemRequest {
    private List<UpdateOrderItemByAdminRequest> orderItems;
}
