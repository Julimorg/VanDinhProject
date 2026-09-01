package com.example.common.dto.color.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetColorSummaryRes {

    private String colorId;

    private String colorName;

    private String colorCode;

    private String hexCode;

    private String colorDescription;

    private String colorImg;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;
}
