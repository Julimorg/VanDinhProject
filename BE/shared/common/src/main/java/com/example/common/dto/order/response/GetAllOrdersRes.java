package com.example.common.dto.order.response;
import com.example.persistence.enumTable.OrderStatus;
import com.example.persistence.enumTable.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAllOrdersRes {
    private String orderId;
    private String orderCode;
    private OrderStatus status;
    private BigDecimal amount;
    private String userId;
    private String userName;
    private String email;
    private String phone;
    private String userAddress;
    private PaymentMethod paymentMethod;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
