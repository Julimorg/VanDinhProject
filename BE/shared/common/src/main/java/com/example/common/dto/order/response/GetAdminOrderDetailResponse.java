package com.example.common.dto.order.response;
import com.example.persistence.enumTable.OrderStatus;
import com.example.persistence.enumTable.PaymentMethod;
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
public class GetAdminOrderDetailResponse {
    private String orderId;
    private String orderCode;
    private OrderStatus status;
    private BigDecimal orderAmount;
    private String id;
    private String userName;
    private String email;
    private String phone;
    private String userAddress;
    private String shipAddress;
    private PaymentMethod paymentMethod;
    private List<CreateOrderItemRes> orderItems;
    private String createBy;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
