package com.example.common.dto.color;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetColorWithSupplierRes {
    private String colorId;
    private String colorName;
    private String colorCode;
}
