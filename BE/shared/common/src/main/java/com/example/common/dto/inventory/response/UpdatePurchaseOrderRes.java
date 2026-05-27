package com.example.common.dto.inventory.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UpdatePurchaseOrderRes {

    private String poCode;

    private String supplierName;

    private String note;

    private String status;

    private LocalDateTime orderDate;

    private LocalDateTime receivedDate;

    private LocalDateTime updateDate;


}
