package com.example.common.dto.color.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAlbumWithColorRes {

    private String albumId;

    private String albumName;

    private String albumImg;

    private List<GetColorSummaryRes> colors;
}
