package com.example.service;
import com.example.common.dto.order.request.UpdateOrderItemByAdminRequest;
import com.example.common.dto.order.request.UpdateOrderItemRequest;
import com.example.common.dto.order.response.UpdateOrderItemByAdminResponse;
import com.example.common.enums.ErrorCode;
import com.example.common.interfaces.products.ProductInternalService;
import com.example.persistence.entity.Order;
import com.example.persistence.entity.OrderItem;
import com.example.persistence.entity.Product;
import com.example.repository.OrderItemRepository;
import com.example.repository.OrderRepository;
import com.example.util.OrderUtilService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final ProductInternalService productInternalService;

    private final OrderUtilService  orderUtilService;

    @Transactional
    public List<UpdateOrderItemByAdminResponse> updateOrderItems(String orderId,
                                                                 UpdateOrderItemRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException(ErrorCode.ORDER_NOT_FOUND + orderId));

        List<UpdateOrderItemByAdminResponse> responses = new ArrayList<>();

        for (UpdateOrderItemByAdminRequest dto : request.getOrderItems()) {

            orderUtilService.validateQuantity(dto.getQuantity());

            OrderItem orderItem = orderUtilService.resolveOrderItem(order, dto);

            Product product = productInternalService.getProductById(dto.getProductId());

            orderUtilService.applyProductSnapshot(orderItem, product);

            // Tính price theo quantity của request
            BigDecimal linePrice = product.getProductPrice()
                    .multiply(BigDecimal.valueOf(dto.getQuantity()));

            orderItem.setQuantity(dto.getQuantity());
            orderItem.setPrice(linePrice);
            orderItem.setUpdateAt(LocalDateTime.now());

            // Lưu rõ ràng để đảm bảo item mới (chưa có ID) được persist
            orderItemRepository.save(orderItem);

            responses.add(orderUtilService.buildResponse(orderItem));
        }

        orderUtilService.recalculateOrderTotals(order);
        orderRepository.save(order);

        return responses;
    }


}
