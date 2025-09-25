package com.example.managementapi.Dto.Response.Order;

import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private List<CreateOrderItemsResponse> orderItems;
    private Payment payment;

    private String firstName;
}
