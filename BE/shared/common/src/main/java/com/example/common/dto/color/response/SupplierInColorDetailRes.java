package com.example.common.dto.color.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierInColorDetailRes {
    private String supplierId;
    private String supplierName;
}
