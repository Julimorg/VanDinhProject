package com.example.managementapi.Dto.Response.Order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderPaymentResponse {
    private String paymentId;
    private String paymentMethod;
    private String paymentStatus;
}
