package com.example.managementapi.Dto.Response.Supplier;


import com.example.managementapi.Dto.Response.Color.GetColorRes;
import com.fasterxml.jackson.annotation.JsonFormat;
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
@Builder
public class ProductInSupplierDetailRes {
    private String productId;
    private String productName;
    private List<String> productImg;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal productPrice;
    private int productQuantity;
}

