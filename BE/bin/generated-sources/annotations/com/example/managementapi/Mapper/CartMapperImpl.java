package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Response.Cart.GetCartRes;
import com.example.managementapi.Entity.Cart;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:49+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CartMapperImpl implements CartMapper {

    @Override
    public GetCartRes toGetCartRes(Cart cart) {
        if ( cart == null ) {
            return null;
        }

        GetCartRes.GetCartResBuilder getCartRes = GetCartRes.builder();

        getCartRes.cartId( cart.getCartId() );
        getCartRes.totalPrice( cart.getTotalPrice() );
        getCartRes.totalQuantity( cart.getTotalQuantity() );

        return getCartRes.build();
    }
}
