package com.example.managementapi.Dto.Request.Color;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateColorReq {
    private String colorName;
    private String colorCode;
    private String colorDescription;
    private String supplierId;
    private MultipartFile colorImg;
}
