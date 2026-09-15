package com.example.common.dto.color.response;

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
public class GetColorRes {

    private String albumId;

    private String albumName;

    private String colorId;

    private String colorName;

    private String colorCode;

    private String hexCode;

    private String colorDescription;

    private String colorImg;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;
}
