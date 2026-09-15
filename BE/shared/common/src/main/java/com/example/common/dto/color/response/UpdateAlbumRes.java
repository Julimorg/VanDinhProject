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
public class UpdateAlbumRes {

    private String albumName;

    private String description;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

}
