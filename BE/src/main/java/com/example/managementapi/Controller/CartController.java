package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Cart.AddItemToCartReq;
import com.example.managementapi.Dto.Request.Cart.UpdateCartItemQuantityReq;
import com.example.managementapi.Dto.Response.Cart.CartItemDetailRes;
import com.example.managementapi.Dto.Response.Cart.GetCartRes;

import com.example.managementapi.Service.CartService;
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
    public ApiResponse<GetCartRes> addProductToCart(@PathVariable String id, @RequestBody AddItemToCartReq req){
        return ApiResponse.<GetCartRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Adding Product Approved")
                .data(cartService.addProductToCart(id, req))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-cart/{userId}")
    public ApiResponse<GetCartRes> getCart(@PathVariable String userId){
        return ApiResponse.<GetCartRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(cartService.getCart(userId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/update-item/{cartItemId}")
    public ApiResponse<CartItemDetailRes> updateCartItem(@PathVariable String cartItemId
            , @RequestBody UpdateCartItemQuantityReq request){
        return ApiResponse.<CartItemDetailRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(cartService.updateCartItem(cartItemId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/delete-item/{cartItemId}")
    public ApiResponse<String> deleteItem(@PathVariable String cartItemId){
        cartService.deleteCartItem(cartItemId);
        return ApiResponse.<String>
                builder()
                .status_code(HttpStatus.OK.value())
                .message("Delete item: " + cartItemId + " successfully! ")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
