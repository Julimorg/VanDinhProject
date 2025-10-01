package com.example.managementapi.Dto.Response.Order;


import com.example.managementapi.Enum.OrderStatus;
import com.example.managementapi.Enum.PaymentMethod;
import com.example.managementapi.Enum.PaymentMethodStatus;
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
public class CreateOrderFromCartRes {
    private String orderId;

    private String orderCode;

    private String userId;

    private String userName;

    private String email;

    private String userAddress;

    private String phone;

    private OrderStatus status;

    private BigDecimal amount;

    private String shipAddress;

    private List<CreateOrderItemRes> orderItems;

    private PaymentMethod paymentMethod;

    private PaymentMethodStatus paymentStatus;

    private String createBy;

    private LocalDateTime createAt;

}
