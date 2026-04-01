package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Response.User.GetUserRes;
import com.example.managementapi.Dto.Response.WishList.AddWishListRes;
import com.example.managementapi.Dto.Response.WishList.GetWishList;
import com.example.managementapi.Service.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("api/v1/wishlist")
@RequiredArgsConstructor
public class WishListController {

    private final WishListService wishListService;

    @GetMapping("/{userId}")
    public ApiResponse<Page<GetWishList>> getWishlist(
            @PageableDefault(size = 10, sort = "createAt", direction = Sort.Direction.ASC) Pageable pageable,
            @PathVariable String userId) {
        return ApiResponse.<Page<GetWishList>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(wishListService.getWishListUser(userId, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/{userId}/check/{productId}")
    public ApiResponse<Boolean> isWishList(
            @PathVariable String userId,
            @PathVariable String productId) {
        return ApiResponse.<Boolean>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(wishListService.isInWishlist(userId, productId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/{userId}/{productId}")
    public ApiResponse<AddWishListRes>addWishList(
            @PathVariable String userId,
            @PathVariable String productId) {
        return ApiResponse.<AddWishListRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(wishListService.addProductToWishList(userId, productId))
                .timestamp(LocalDateTime.now())
                .build();
    }


}
