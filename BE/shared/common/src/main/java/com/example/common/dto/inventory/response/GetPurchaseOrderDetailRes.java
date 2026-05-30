package com.example.common.dto.inventory.response;


import com.example.common.annotationCustome.ValidProductTypeFields;
import com.example.persistence.enumTable.PurchaseOrderStatus;
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
@ValidProductTypeFields
@Builder
public class GetPurchaseOrderDetailRes {

    private String purchaseOrderId;

    private String poCode;

    private String supplierName;

    private String note;

    private String createdBy;

    private String status;

    private BigDecimal totalPrice;

    private int totalQuantity;

    private List<ListPurchaseItemOrder> items;

    private LocalDateTime orderDate;

    private LocalDateTime receivedDate;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;


}
