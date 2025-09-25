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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemService {
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Autowired
    private OrderRepository orderRepository;

    public List<UpdateOrderItemByAdminResponse> updateOrderItems(String orderId, UpdateOrderItemRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        List<UpdateOrderItemByAdminResponse> responses = new ArrayList<>();

        for (UpdateOrderItemByAdminRequest dto : request.getOrderItems()) {
            OrderItem orderItem = orderItemRepository.findById(dto.getOrderItemId())
                    .orElseThrow(() -> new RuntimeException("OrderItem not found"));

            if (dto.getProductId() != null) {
                Product product = productRepository.findById(dto.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                orderItem.setProduct(product);
                orderItem.setPrice(product.getProductPrice());
            }

            orderItem.setQuantity(dto.getQuantity());

            orderItemRepository.save(orderItem);

            UpdateOrderItemByAdminResponse res = UpdateOrderItemByAdminResponse.builder()
                    .orderItemId(orderItem.getOrderItemId())
                    .quantity(orderItem.getQuantity())
                    .price(orderItem.getPrice())
                    .createAt(orderItem.getCreateAt())
                    .updateAt(orderItem.getUpdateAt())
                    .build();

            responses.add(res);

            int totalQuantity = order.getOrderItems().stream()
                    .mapToInt(OrderItem::getQuantity)
                    .sum();
            order.setTotal_quantity(totalQuantity);

            BigDecimal total = order.getOrderItems().stream()
                    .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            order.setOrderAmount(total);
            orderRepository.save(order);
        }

        return responses;
    }

}
