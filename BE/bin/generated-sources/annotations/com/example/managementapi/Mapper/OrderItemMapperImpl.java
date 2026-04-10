package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.OrderItem.UpdateOrderItemByAdminRequest;
import com.example.managementapi.Dto.Response.Order.CreateOrderItemRes;
import com.example.managementapi.Dto.Response.Order.SearchOrderItemResponse;
import com.example.managementapi.Dto.Response.Order.UpdateOrderItemByAdminResponse;
import com.example.managementapi.Entity.OrderItem;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:48+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class OrderItemMapperImpl implements OrderItemMapper {

    @Override
    public SearchOrderItemResponse toSearchOrderItemResponse(OrderItem orderItemn) {
        if ( orderItemn == null ) {
            return null;
        }

        SearchOrderItemResponse.SearchOrderItemResponseBuilder searchOrderItemResponse = SearchOrderItemResponse.builder();

        searchOrderItemResponse.categoryName( orderItemn.getCategoryName() );
        searchOrderItemResponse.colorName( orderItemn.getColorName() );
        searchOrderItemResponse.createAt( orderItemn.getCreateAt() );
        searchOrderItemResponse.orderItemId( orderItemn.getOrderItemId() );
        searchOrderItemResponse.productCode( orderItemn.getProductCode() );
        List<String> list = orderItemn.getProductImage();
        if ( list != null ) {
            searchOrderItemResponse.productImage( new ArrayList<String>( list ) );
        }
        searchOrderItemResponse.productName( orderItemn.getProductName() );
        searchOrderItemResponse.productPrice( orderItemn.getProductPrice() );
        searchOrderItemResponse.productQuantity( orderItemn.getProductQuantity() );
        searchOrderItemResponse.productUnit( orderItemn.getProductUnit() );
        searchOrderItemResponse.productVolume( orderItemn.getProductVolume() );
        searchOrderItemResponse.quantity( orderItemn.getQuantity() );

        return searchOrderItemResponse.build();
    }

    @Override
    public CreateOrderItemRes toOrderItemRes(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        CreateOrderItemRes.CreateOrderItemResBuilder createOrderItemRes = CreateOrderItemRes.builder();

        createOrderItemRes.categoryName( orderItem.getCategoryName() );
        createOrderItemRes.colorName( orderItem.getColorName() );
        createOrderItemRes.createAt( orderItem.getCreateAt() );
        createOrderItemRes.orderItemId( orderItem.getOrderItemId() );
        createOrderItemRes.productCode( orderItem.getProductCode() );
        createOrderItemRes.productId( orderItem.getProductId() );
        List<String> list = orderItem.getProductImage();
        if ( list != null ) {
            createOrderItemRes.productImage( new ArrayList<String>( list ) );
        }
        createOrderItemRes.productName( orderItem.getProductName() );
        createOrderItemRes.productPrice( orderItem.getProductPrice() );
        createOrderItemRes.productQuantity( orderItem.getProductQuantity() );
        createOrderItemRes.productUnit( orderItem.getProductUnit() );
        createOrderItemRes.productVolume( orderItem.getProductVolume() );
        createOrderItemRes.quantity( orderItem.getQuantity() );

        return createOrderItemRes.build();
    }

    @Override
    public List<CreateOrderItemRes> toOrderItemResList(List<OrderItem> orderItems) {
        if ( orderItems == null ) {
            return null;
        }

        List<CreateOrderItemRes> list = new ArrayList<CreateOrderItemRes>( orderItems.size() );
        for ( OrderItem orderItem : orderItems ) {
            list.add( toOrderItemRes( orderItem ) );
        }

        return list;
    }

    @Override
    public void updateOrderItem(OrderItem orderItem, UpdateOrderItemByAdminRequest request) {
        if ( request == null ) {
            return;
        }

        orderItem.setOrderItemId( request.getOrderItemId() );
        orderItem.setProductId( request.getProductId() );
        orderItem.setQuantity( request.getQuantity() );
    }

    @Override
    public UpdateOrderItemByAdminResponse toUpdateOrderItemByAdminResponse(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        UpdateOrderItemByAdminResponse.UpdateOrderItemByAdminResponseBuilder updateOrderItemByAdminResponse = UpdateOrderItemByAdminResponse.builder();

        updateOrderItemByAdminResponse.createAt( orderItem.getCreateAt() );
        updateOrderItemByAdminResponse.orderItemId( orderItem.getOrderItemId() );
        updateOrderItemByAdminResponse.price( orderItem.getPrice() );
        updateOrderItemByAdminResponse.productName( orderItem.getProductName() );
        updateOrderItemByAdminResponse.quantity( orderItem.getQuantity() );
        updateOrderItemByAdminResponse.updateAt( orderItem.getUpdateAt() );

        return updateOrderItemByAdminResponse.build();
    }
}
