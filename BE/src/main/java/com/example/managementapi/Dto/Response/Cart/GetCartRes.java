package com.example.managementapi.Dto.Response.Cart;


import com.example.managementapi.Entity.User;
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
public class GetCartRes {
    private String cartId;
    private String userId;
    private BigDecimal totalPrice;
    private int totalQuantity;
    private List<CartItemDetailRes> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
