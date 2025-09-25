package com.example.managementapi.Dto.Response.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public interface SearchProductRes {
    String getProductId();
    String getProductName();
}