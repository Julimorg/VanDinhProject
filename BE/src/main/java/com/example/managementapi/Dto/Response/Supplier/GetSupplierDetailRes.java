package com.example.managementapi.Dto.Response.Supplier;


import com.example.managementapi.Dto.Response.Color.GetColorRes;
import com.example.managementapi.Dto.Response.Product.ProductRes;
import com.example.managementapi.Entity.Color;
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
public class GetSupplierDetailRes {
    private String supplierId;
    private String supplierName;
    private String supplierAddress;
    private String supplierPhone;
    private String supplierEmail;
    private String supplierImg;

    private List<ProductRes> products;

    private List<GetColorRes> colors;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
