package com.example.common.dto.color.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColorImportItemReq {
    private String colorName;
    private String colorCode;
    private String hexCode;
    private String colorFamily;
    private String colorCollection;
    private String finishType;
    private Boolean isActive;
    private String supplierId;
    private String albumId;
}
