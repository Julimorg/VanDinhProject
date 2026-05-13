package com.example.common.dto.order.request;
import com.example.persistence.enumTable.PaymentMethod;
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
//    private List<UpdateOrderItemByAdminRequest> orderItems;
    private PaymentMethod paymentMethod;
    private String id;
}
