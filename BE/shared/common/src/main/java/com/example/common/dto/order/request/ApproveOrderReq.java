package com.example.common.dto.order.request;
import com.example.persistence.enumTable.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApproveOrderReq {
    @NotNull(message = "Order Status cannot be blanked!")
    private OrderStatus orderStatus;
}
