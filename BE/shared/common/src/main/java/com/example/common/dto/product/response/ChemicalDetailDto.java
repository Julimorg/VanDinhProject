package com.example.common.dto.product.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChemicalDetailDto {

    private String        productId;

    private String              chemicalType;

    private String              volume;

    private Map<String, Object> extraSpecs;

}
