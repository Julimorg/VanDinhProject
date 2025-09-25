package com.example.managementapi.Dto.Response.Color;

import com.example.managementapi.Dto.Response.Product.ProductRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierRes;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.Supplier;
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
public class GetColorDetailRes {
    private String colorId;
    private String colorName;
    private String colorCode;
    private String colorDescription;
    private String colorImg;

    private List<GetSupplierRes> supplier;


    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
