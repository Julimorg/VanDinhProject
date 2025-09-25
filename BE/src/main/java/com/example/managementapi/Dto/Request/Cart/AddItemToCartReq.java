package com.example.managementapi.Dto.Request.Cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddItemToCartReq {
    private String productId;
    private int quantity;
}


