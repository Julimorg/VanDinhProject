package com.example.common.dto.inventory.response;

import jakarta.validation.constraints.NotBlank;
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
public class CreateItemInPurchaseOrderRes {

    private String purchaseOrderId;

    private String poCode;

    private String status;

    private LocalDateTime receivedDate;

    private List<ListItemsInPurchaseOrderAfterCreate> items;

}
