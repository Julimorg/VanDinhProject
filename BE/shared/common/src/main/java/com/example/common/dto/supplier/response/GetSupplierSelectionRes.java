package com.example.common.dto.supplier.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetSupplierSelectionRes {
    private String supplierId;
    private String supplierName;
}
