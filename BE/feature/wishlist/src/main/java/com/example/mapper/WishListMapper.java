package com.example.mapper;
import com.example.common.dto.wishlist.response.AddWishListRes;
import com.example.common.dto.wishlist.response.GetWishList;
import com.example.persistence.entity.WishList;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Mapper(componentModel = "spring")
public interface WishListMapper {

    @Mapping(source = "wishListId", target = "wishListId")
    @Mapping(source = "product.productId", target = "productId")
    @Mapping(source = "product.productName", target = "productName")
    @Mapping(source = "product.productDescription", target = "productDescription")
    @Mapping(source = "product.productPrice", target = "productPrice")
    @Mapping(source = "product.discount", target = "discount")
    @Mapping(source = "product.productImage", target = "productImage")
    @Mapping(source = "product.productVolume", target = "productVolume")
    @Mapping(source = "product.productUnit", target = "productUnit")
    @Mapping(source = "product.productQuantity", target = "productQuantity")
    @Mapping(source = "createAt", target = "createAt")
    GetWishList toWishlistResponse(WishList wishlist);

    @Mapping(source = "wishListId", target = "wishListId")
    @Mapping(source = "product.productId", target = "productId")
    @Mapping(source = "product.productName", target = "productName")
    @Mapping(source = "product.productDescription", target = "productDescription")
    @Mapping(source = "product.productPrice", target = "productPrice")
    @Mapping(source = "product.discount", target = "discount")
    @Mapping(source = "product.productImage", target = "productImage")
    @Mapping(source = "product.productVolume", target = "productVolume")
    @Mapping(source = "product.productUnit", target = "productUnit")
    @Mapping(source = "product.productQuantity", target = "productQuantity")
    @Mapping(source = "createAt", target = "createAt")
    AddWishListRes toAddWishListRes(WishList wishList);
}
