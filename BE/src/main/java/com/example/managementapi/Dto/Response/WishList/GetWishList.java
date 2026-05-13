package com.example.managementapi.Dto.Response.WishList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetWishList {
    private String wishListId;
    private String productId;
    private String productName;
    private String productDescription;

    private BigDecimal productPrice;
    private double discount;

    private List<String> productImage;
    private String productVolume;
    private String productUnit;

    private int productQuantity;
    private int totalCount;

    private LocalDateTime createAt;
}
