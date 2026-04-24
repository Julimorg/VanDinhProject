package com.example.common.dto.color;

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

    private SupplierInColorDetailRes supplier;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
