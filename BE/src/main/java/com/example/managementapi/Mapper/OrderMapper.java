package com.example.managementapi.Mapper;


import com.example.managementapi.Dto.Request.Order.CreateOrderRequest;
import com.example.managementapi.Dto.Request.Order.UpdateOrderByAdminRequest;
import com.example.managementapi.Dto.Response.Order.*;
import com.example.managementapi.Dto.Response.Product.ProductForCartItem;
import com.example.managementapi.Dto.Response.User.OrderInGetUserDetailByAdminRes;
import com.example.managementapi.Dto.Response.User.OrderInGetUserDetailRes;
import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {


    GetOrderUserRes toGetOrderResponse(Order order);
    CreateOrderItemRes toOrderItemRes(OrderItem orderItem);
    ProductForCartItem toProductForCartItem(Product product);

    @Mapping(source = "payment.paymentMethod", target = "paymentMethod")
    OrderInGetUserDetailByAdminRes toOrderInGetUserDetailByAdminRes(Order order);

    @Mapping(source = "payment.paymentMethod", target = "paymentMethod")
    OrderInGetUserDetailRes toOrderInGetUserDetailRes(Order order);


    @Mapping(source = "orderId", target = "orderId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "orderCode", target = "orderCode")
    @Mapping(source = "orderStatus", target = "status")
    @Mapping(source = "orderAmount", target = "amount")
    @Mapping(source = "user.userName", target = "userName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    @Mapping(source = "user.userAddress", target = "userAddress")
    @Mapping(source = "payment.paymentMethod", target = "paymentMethod")
    GetAllOrdersRes toGetAllOrdersRes(Order order);


    @Mapping(source = "orderId", target = "orderId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "orderCode", target = "orderCode")
    @Mapping(source = "orderStatus", target = "status")
    @Mapping(source = "orderAmount", target = "amount")
    @Mapping(source = "user.userName", target = "userName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    @Mapping(source = "user.userAddress", target = "userAddress")
    @Mapping(source = "payment.paymentMethod", target = "paymentMethod")
    GetUserOrdersRes toGetUserOrdersRes(Order order);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "orderCode", target = "orderCode")
    @Mapping(source = "orderStatus", target = "status")
    @Mapping(source = "orderAmount", target = "amount")
    @Mapping(source = "user.userName", target = "userName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    @Mapping(source = "user.userAddress", target = "userAddress")
    @Mapping(source = "payment.paymentMethod", target = "paymentMethod")
    @Mapping(source = "orderItems", target = "items")
    GetUserOrdersDetailRes toGetUserOrdersDetailRes(Order order);


    Order toOrder(CreateOrderRequest request);
    CreateOrderResponse toCreateOrderResponse(Order order);

    //Get list
    GetOrdersResponse toGetOrdersResponse(Order orders);

    //Search
    @Mapping(source = "orderStatus", target = "status")
    @Mapping(source = "orderAmount", target = "amount")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    @Mapping(source = "user.userAddress", target = "userAddress")
    @Mapping(source = "payment.paymentMethod", target = "paymentMethod")
    @Mapping(source = "payment.paymentStatus", target = "paymentStatus")
    @Mapping(source = "payment.paymentId", target = "paymentId")
    SearchOrdersResponse toSearchOrdersResponse(Order orders);

    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "orderAmount", ignore = true)
    @Mapping(target = "orderStatus", ignore = true)
    @Mapping(target = "total_quantity", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "updateAt", ignore = true)
    @Mapping(target = "completeAt", ignore = true)
    @Mapping(target = "payment", ignore = true)
    void updateOrder(@MappingTarget Order order, UpdateOrderByAdminRequest request);

    UpdateOrderByAdminResponse toUpdateOrderByAdminResponse(Order order);

}
