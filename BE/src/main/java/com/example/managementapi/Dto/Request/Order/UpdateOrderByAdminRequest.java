package com.example.managementapi.Dto.Request.Order;

import com.example.managementapi.Dto.Request.OrderItem.UpdateOrderItemByAdminRequest;
import com.example.managementapi.Enum.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderByAdminRequest {
    private String shipAddress;
    private List<UpdateOrderItemByAdminRequest> orderItems;
    private PaymentMethod paymentMethod;
    private String id;
}
