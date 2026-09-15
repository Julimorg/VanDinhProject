package com.example.common.dto.color.request;

import com.example.common.dto.color.response.SupplierInColorDetailRes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateColorReq {

    private String colorName;
    private String colorCode;
    private String colorDescription;
    private String supplierId;
    private String albumId;
    private MultipartFile colorImg;
}
