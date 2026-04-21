package com.example.common.dto.order.response;

import com.example.common.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserOrdeDetailRes {

    private String orderId;

    private String orderCode;

    private String shipAddress;

    private int total_quantity;

    private BigDecimal orderAmount;

    private OrderStatus orderStatus;

    private String paymentMethod;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private LocalDateTime deletedAt;

    private LocalDateTime completeAt;

}
