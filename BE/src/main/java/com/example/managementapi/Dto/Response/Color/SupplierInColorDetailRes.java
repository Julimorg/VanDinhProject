package com.example.managementapi.Dto.Response.Color;

import com.example.managementapi.Dto.Response.Supplier.GetSupplierRes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierInColorDetailRes {
    private String supplierId;
    private String supplierName;
}
