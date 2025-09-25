package com.example.managementapi.Mapper;


import com.example.managementapi.Dto.Response.Cart.GetCartRes;
import com.example.managementapi.Entity.Cart;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {

    GetCartRes toGetCartRes(Cart cart);
}
