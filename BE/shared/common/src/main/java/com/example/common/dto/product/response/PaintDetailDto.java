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
public class PaintDetailDto {

    private String productId;

    private String colorId;

    private String colorName;

    private String colorCode;

    private String hexCode;

    private String surfaceType;

    private String volume;

    private Map<String, Object> extraSpecs;

}
