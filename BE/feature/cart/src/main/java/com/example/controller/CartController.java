package com.example.controller;
import com.example.common.dto.cart.request.AddItemToCartReq;
import com.example.common.dto.cart.request.UpdateCartItemQuantityReq;
import com.example.common.dto.cart.response.CartItemDetailRes;
import com.example.common.dto.cart.response.GetCartRes;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/cart")
public class CartController {

    private final CartService cartService;


    @PostMapping("/add-items/{id}")
    public ApiResponse<GetCartRes> addProductToCart(@PathVariable String id,
                                                    @RequestBody AddItemToCartReq req){
        return ApiResponse.<GetCartRes>builder()
                .status_code(SuccessCode.ADD_PRODUCT_TO_CART.getStatusCode().value())
                .message(SuccessCode.ADD_PRODUCT_TO_CART.getMessage())
                .data(cartService.addProductToCart(id, req))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-cart/{userId}")
    public ApiResponse<GetCartRes> getCart(@PathVariable String userId){
        return ApiResponse.<GetCartRes>builder()
                .status_code(SuccessCode.GET_CART.getStatusCode().value())
                .message(SuccessCode.GET_CART.getMessage())
                .data(cartService.getCart(userId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/update-item/{cartItemId}")
    public ApiResponse<CartItemDetailRes> updateCartItem(@PathVariable String cartItemId
            , @RequestBody UpdateCartItemQuantityReq request){
        return ApiResponse.<CartItemDetailRes>builder()
                .status_code(SuccessCode.UPDATE_CART.getStatusCode().value())
                .message(SuccessCode.UPDATE_CART.getMessage())
                .data(cartService.updateCartItem(cartItemId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/delete-item/{cartItemId}")
    public ApiResponse<String> deleteItem(@PathVariable String cartItemId){
        cartService.deleteCartItem(cartItemId);
        return ApiResponse.<String>
                builder()
                .status_code(SuccessCode.DELETE_CART.getStatusCode().value())
                .message("Delete item: " + cartItemId + " successfully! ")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
