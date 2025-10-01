package com.example.managementapi.Dto.Response.User;

import com.example.managementapi.Entity.Payment;
import com.example.managementapi.Enum.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderInGetUserDetailByAdminRes {

    private String orderId;

    private String orderCode;

    private String shipAddress;

    private int total_quantity;

    private BigDecimal orderAmount;

    private OrderStatus orderStatus;

    private String paymentMethod;

    private String createBy;

    private String updateBy;

    private String approvedBy;

    private String canceledBy;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private LocalDateTime deletedAt;

    private LocalDateTime completeAt;

}
