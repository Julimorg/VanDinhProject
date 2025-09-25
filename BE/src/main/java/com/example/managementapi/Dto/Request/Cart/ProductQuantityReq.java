package com.example.managementapi.Dto.Request.Cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductQuantityReq  {
    private String productId;
    private int quantity;
}
