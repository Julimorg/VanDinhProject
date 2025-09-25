package com.example.managementapi.Dto.Request.Order;

import com.example.managementapi.Entity.OrderItem;
import com.example.managementapi.Entity.Payment;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    private String orderCode;
    private String orderStatus;
    private List<GetProductQuantityRequest> orderItems;
    private PaymentMethod paymentMethod;
}
