package com.example.mapper;
import com.example.common.dto.order.request.UpdateOrderItemByAdminRequest;
import com.example.common.dto.order.response.CreateOrderItemRes;
import com.example.common.dto.order.response.SearchOrderItemResponse;
import com.example.common.dto.order.response.UpdateOrderItemByAdminResponse;
import com.example.persistence.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    //** ===============================   GET RESPONSE   ===========================
//    @Mapping(source = "product.productName", target = "productName")
//    @Mapping(source = "product.productImage", target = "productImage")
//    @Mapping(source = "product.productVolume", target = "productVolume")
//    @Mapping(source = "product.productUnit", target = "productUnit")
//    @Mapping(source = "product.productCode", target = "productCode")
//    @Mapping(source = "product.productQuantity", target = "productQuantity")
//    @Mapping(source = "product.productPrice", target = "productPrice")
//    @Mapping(source = "product.color.colorName", target = "colorName")
//    @Mapping(source = "product.category.categoryName", target = "categoryName")
    SearchOrderItemResponse toSearchOrderItemResponse(OrderItem orderItemn);
    //** ===============================   POST RESPONSE   ===========================

    CreateOrderItemRes toOrderItemRes(OrderItem orderItem);


    List<CreateOrderItemRes> toOrderItemResList(List<OrderItem> orderItems);

    void updateOrderItem(@MappingTarget OrderItem orderItem, UpdateOrderItemByAdminRequest request);

    UpdateOrderItemByAdminResponse toUpdateOrderItemByAdminResponse(OrderItem orderItem);
}
