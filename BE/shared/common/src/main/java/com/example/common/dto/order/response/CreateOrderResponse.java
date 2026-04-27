package com.example.common.dto.order.response;

import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderResponse {
    private String orderId;
    private String orderCode;
    private String orderStatus;
    private double orderAmount;
    private String shipAddress;
    private List<CreateOrderItemsResponse> orderItems;
    private CreateOrderPaymentResponse payment;

    private String firstName;
    private LocalDateTime createAt;
}
