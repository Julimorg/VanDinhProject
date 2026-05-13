package com.example.common.dto.order.response;
import com.example.persistence.enumTable.OrderStatus;
import com.example.persistence.enumTable.PaymentMethod;
import com.example.persistence.enumTable.PaymentMethodStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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
    private String userName;
    private String email;
    private String phone;
    private String userAddress;
    private List<CreateOrderItemRes> items;

    private PaymentMethodStatus paymentMethodStatus;

    private PaymentMethod paymentMethod;

    private LocalDate createAt;
    private LocalDate updateAt;
}
