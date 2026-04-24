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
public class CreateColorRes {
    private String colorId;
    private String colorName;
    private String colorCode;
    private String colorDescription;
    private SupplierInColorDetailRes supplier;
    private String colorImg;


    private LocalDateTime createAt;

}
