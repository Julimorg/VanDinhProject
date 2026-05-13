package com.example.common.dto.order.request;
import com.example.persistence.enumTable.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderReq {
    @NotNull(message = "Order Payment cannot be blanked!")
    private PaymentMethod paymentMethod;
    private String shipAddress;
}
