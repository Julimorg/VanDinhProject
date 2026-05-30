package com.example.common.dto.inventory.request;

import com.example.persistence.enumTable.PurchaseOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePurchaseOrderStatusReq {

    private PurchaseOrderStatus status;

}
