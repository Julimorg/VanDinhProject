package com.example.managementapi.Dto.Response.Product;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetProductSelectionRes {
    private String productId;
    private String productName;
}
