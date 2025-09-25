package com.example.managementapi.Dto.Response.Order;


import com.example.managementapi.Enum.OrderStatus;
import com.example.managementapi.Enum.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetOrdersResponse {
    private String orderId;
    private String orderCode;
    private OrderStatus status;
    private BigDecimal amount;

    private String userId;
    private String email;
    private String phone;
    private String userAddress;
    private List<CreateOrderItemRes> orderItems;
    private String paymentId;
    private PaymentMethod paymentMethod;
    private String paymentStatus;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private LocalDateTime deletedAt;

    private LocalDateTime completeAt;
}
