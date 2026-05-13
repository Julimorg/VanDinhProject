package com.example.common.dto.cart.response;


import com.example.common.dto.product.response.ProductForCartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDetailRes {
    private String cartItemId;
    private String cartId;
    private ProductForCartItem product;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;


}
