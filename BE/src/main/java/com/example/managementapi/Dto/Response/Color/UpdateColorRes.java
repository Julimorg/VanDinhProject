package com.example.managementapi.Dto.Response.Color;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateColorRes {
    private String colorId;
    private String colorName;
    private String colorCode;
    private String colorDescription;
    private String colorImg;


    private LocalDateTime updateAt;

}
