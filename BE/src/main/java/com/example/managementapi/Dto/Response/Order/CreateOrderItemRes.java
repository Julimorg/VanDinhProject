package com.example.managementapi.Dto.Response.Order;


import com.example.managementapi.Dto.Response.Product.ProductForCartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderItemRes {
    private String orderItemId;

    private String orderId;

    private int quantity;

    private ProductForCartItem product;

    private LocalDateTime createAt;

}
