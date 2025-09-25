package com.example.managementapi.Dto.Response.Cart;


import com.fasterxml.jackson.annotation.JsonFormat;
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
public class AddProductToCartRes {
    private String cartId;
    private String userId;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal totalPrice;
    private CartItemDetailRes items;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;


}
