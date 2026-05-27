package com.example.common.dto.inventory.request;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UpdatePurchaseOrderReq {

    private String poCode;

    private String supplierName;

    private String note;

    private String status;



}
