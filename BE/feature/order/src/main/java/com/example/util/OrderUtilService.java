package com.example.util;

import com.example.common.dto.order.request.UpdateOrderItemByAdminRequest;
import com.example.common.dto.order.response.UpdateOrderItemByAdminResponse;
import com.example.common.enums.ErrorCode;
import com.example.persistence.entity.Order;
import com.example.persistence.entity.OrderItem;
import com.example.persistence.entity.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderUtilService {

    public void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
    }

    public void applyProductSnapshot(OrderItem orderItem, Product product) {
        orderItem.setProductId(product.getProductId());
        orderItem.setProductName(product.getProductName());
        orderItem.setProductCode(product.getProductCode());
        orderItem.setProductImage(new ArrayList<>(product.getProductImage()));
        orderItem.setProductVolume(product.getProductVolume());
        orderItem.setProductUnit(product.getProductUnit());
        orderItem.setProductPrice(product.getProductPrice());
        orderItem.setDiscount(product.getDiscount());
        orderItem.setColorName(product.getColor().getColorName());
        orderItem.setCategoryName(product.getCategory().getCategoryName());
    }

    public void recalculateOrderTotals(Order order) {
        int totalQuantity = order.getOrderItems().stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(OrderItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotal_quantity(totalQuantity);
        order.setOrderAmount(totalAmount);
        order.setUpdateAt(LocalDateTime.now());
    }

    public UpdateOrderItemByAdminResponse buildResponse(OrderItem orderItem) {
        return UpdateOrderItemByAdminResponse.builder()
                .orderItemId(orderItem.getOrderItemId())
                .productName(orderItem.getProductName())
                .quantity(orderItem.getQuantity())
                .price(orderItem.getPrice())
                .createAt(orderItem.getCreateAt())
                .updateAt(orderItem.getUpdateAt())
                .build();
    }

    public OrderItem resolveOrderItem(Order order, UpdateOrderItemByAdminRequest dto) {
        if (dto.getOrderItemId() != null) {
            return order.getOrderItems().stream()
                    .filter(i -> i.getOrderItemId().equals(dto.getOrderItemId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            ErrorCode.ORDER_ITEM_NOT_FOUND.getMessage() + dto.getOrderItemId()));
        }

        OrderItem newItem = new OrderItem();
        newItem.setOrder(order);
        newItem.setCreateAt(LocalDateTime.now());
        order.getOrderItems().add(newItem);
        return newItem;
    }
}
