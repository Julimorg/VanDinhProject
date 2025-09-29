package com.example.managementapi.Mapper;


import com.example.managementapi.Dto.Request.OrderItem.UpdateOrderItemByAdminRequest;
import com.example.managementapi.Dto.Response.Order.CreateOrderItemRes;
import com.example.managementapi.Dto.Response.Order.UpdateOrderItemByAdminResponse;
import com.example.managementapi.Entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrderItemMapper {

    @Mapping(source = "product.productName", target = "productName")
    @Mapping(source = "product.productImage", target = "productImage")
    @Mapping(source = "product.productVolume", target = "productVolume")
    @Mapping(source = "product.productUnit", target = "productUnit")
    @Mapping(source = "product.productCode", target = "productCode")
    @Mapping(source = "product.productQuantity", target = "productQuantity")
    @Mapping(source = "product.productPrice", target = "productPrice")
    @Mapping(source = "product.color.colorName", target = "colorName")
    @Mapping(source = "product.category.categoryName", target = "categoryName")
    CreateOrderItemRes toOrderItemRes(OrderItem orderItem);


    List<CreateOrderItemRes> toOrderItemResList(List<OrderItem> orderItems);

    void updateOrderItem(@MappingTarget OrderItem orderItem, UpdateOrderItemByAdminRequest request);

    UpdateOrderItemByAdminResponse toUpdateOrderItemByAdminResponse(OrderItem orderItem);
}
