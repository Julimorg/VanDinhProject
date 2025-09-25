package com.example.managementapi.Dto.Response.Order;

import com.example.managementapi.Entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderByAdminResponse {
    private String orderId;
    private String orderCode;
    private String orderStatus;
    private BigDecimal orderAmount;
    private String shipAddress;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private List<UpdateOrderItemByAdminResponse> orderItems;
    private Payment payment;
}
