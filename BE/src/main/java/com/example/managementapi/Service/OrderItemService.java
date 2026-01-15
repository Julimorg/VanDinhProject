package com.example.managementapi.Service;

import com.example.managementapi.Dto.Request.OrderItem.UpdateOrderItemByAdminRequest;
import com.example.managementapi.Dto.Request.OrderItem.UpdateOrderItemRequest;
import com.example.managementapi.Dto.Response.Order.UpdateOrderItemByAdminResponse;
import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Mapper.OrderItemMapper;
import com.example.managementapi.Repository.OrderItemRepository;
import com.example.managementapi.Repository.OrderRepository;
import com.example.managementapi.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final OrderItemMapper orderItemMapper;
    private final OrderRepository orderRepository;

    @Transactional
    public List<UpdateOrderItemByAdminResponse> updateOrderItems(String orderId, UpdateOrderItemRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

//        order.getOrderItems().removeIf(
//                item -> request.getOrderItems().stream()
//                        .noneMatch(dto -> dto.getOrderItemId() != null && dto.getOrderItemId().equals(item.getOrderItemId()))
//        );

        List<UpdateOrderItemByAdminResponse> responses = new ArrayList<>();

        for (UpdateOrderItemByAdminRequest dto : request.getOrderItems()) {
            OrderItem orderItem;

            if (dto.getOrderItemId() != null) {

                orderItem = order.getOrderItems().stream()
                        .filter(i -> i.getOrderItemId().equals(dto.getOrderItemId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("OrderItem not found"));
            } else {

                orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setCreateAt(LocalDateTime.now());
                order.getOrderItems().add(orderItem);
            }


            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

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

            // Set quantity và tính price
            orderItem.setQuantity(dto.getQuantity());
            orderItem.setPrice(product.getProductPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
            orderItem.setUpdateAt(LocalDateTime.now());

            responses.add(UpdateOrderItemByAdminResponse.builder()
                    .orderItemId(orderItem.getOrderItemId())
                    .quantity(orderItem.getQuantity())
                    .price(orderItem.getPrice())
                    .productName(orderItem.getProductName())
                    .price(orderItem.getProductPrice())
                    .createAt(orderItem.getCreateAt())
                    .updateAt(orderItem.getUpdateAt())
                    .build());
        }

        // Tính lại tổng quantity và amount
        order.setTotal_quantity(order.getOrderItems().stream()
                .mapToInt(OrderItem::getQuantity)
                .sum());

        BigDecimal total = order.getOrderItems().stream()
                .map(OrderItem::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setOrderAmount(total);
        order.setUpdateAt(LocalDateTime.now());

        orderRepository.save(order);

        return responses;
    }
}