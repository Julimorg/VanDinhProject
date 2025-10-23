package com.example.managementapi.Dto.Response.Supplier;


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
