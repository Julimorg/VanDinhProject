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
public class ToolDetailDto {
    private String              toolType;
    private String              size;
    private Map<String, Object> extraSpecs;
}
