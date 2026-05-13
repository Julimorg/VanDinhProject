package com.example.common.dto.order.response;
import com.example.persistence.enumTable.OrderStatus;
import com.example.persistence.enumTable.PaymentMethod;
import com.example.persistence.enumTable.PaymentMethodStatus;
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
