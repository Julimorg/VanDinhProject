package com.example.managementapi.Dto.Response.Order;


import com.example.managementapi.Enum.OrderStatus;
import com.example.managementapi.Enum.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetUserOrdersDetailRes {
    private String orderId;
    private String orderCode;
    private OrderStatus status;
    private BigDecimal amount;
    private String userId;
    private String email;
    private String phone;
    private String userAddress;
    private OrderItemRes items;
    private PaymentMethod paymentMethod;

    private LocalDate createAt;
    private LocalDate updateAt;
}
