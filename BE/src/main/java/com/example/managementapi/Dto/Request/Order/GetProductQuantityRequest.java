package com.example.managementapi.Dto.Request.Order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetProductQuantityRequest {
    private String productId;
    private int quantity;
}
