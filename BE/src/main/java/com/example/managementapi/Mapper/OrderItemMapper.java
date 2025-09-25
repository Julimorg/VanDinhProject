package com.example.managementapi.Mapper;


import com.example.managementapi.Dto.Request.OrderItem.UpdateOrderItemByAdminRequest;
import com.example.managementapi.Dto.Response.Order.CreateOrderItemRes;
import com.example.managementapi.Dto.Response.Order.UpdateOrderItemByAdminResponse;
import com.example.managementapi.Entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrderItemMapper {
    CreateOrderItemRes toOrderItemRes(OrderItem orderItem);
    List<CreateOrderItemRes> toOrderItemResList(List<OrderItem> orderItems);

    void updateOrderItem(@MappingTarget OrderItem orderItem, UpdateOrderItemByAdminRequest request);

    UpdateOrderItemByAdminResponse toUpdateOrderItemByAdminResponse(OrderItem orderItem);
}
