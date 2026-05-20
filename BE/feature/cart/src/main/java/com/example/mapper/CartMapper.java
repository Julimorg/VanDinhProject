package com.example.mapper;
import com.example.common.dto.cart.response.CartItemDetailRes;
import com.example.common.dto.cart.response.GetCartRes;
import com.example.common.dto.product.response.ProductForCartItem;
import com.example.persistence.entity.Cart;
import com.example.persistence.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {

    Cart toGetCartByIdWithInterface( Cart cart);

//    @Mapping(source = "user.userId",  target = "userId")
    @Mapping(source = "createAt",     target = "createdAt")
    @Mapping(source = "updateAt",     target = "updatedAt")
    @Mapping(source = "cartItems",    target = "items")
    GetCartRes toGetCartRes(Cart cart);

    @Mapping(source = "cart.cartId",  target = "cartId")
    @Mapping(source = "cartItem",     target = "product")
    CartItemDetailRes toCartItemDetailRes(CartItem cartItem);


    @Mapping(source = "product.productId",              target = "productId")
    @Mapping(source = "product.productName",            target = "productName")
    @Mapping(source = "product.productImage",           target = "productImage")
//    @Mapping(source = "product.productVolume",          target = "productVolume")
//    @Mapping(source = "product.productUnit",            target = "productUnit")
    @Mapping(source = "product.productCode",            target = "productCode")
    @Mapping(source = "quantity",                       target = "productQuantity")
    @Mapping(source = "product.discount",               target = "discount")
    @Mapping(source = "product.productPrice",           target = "productPrice")
//    @Mapping(source = "product.color.colorCode",        target = "colorName")
    @Mapping(source = "product.category.categoryName",  target = "categoryName")
    ProductForCartItem toProductForCartItem(CartItem cartItem);


}
