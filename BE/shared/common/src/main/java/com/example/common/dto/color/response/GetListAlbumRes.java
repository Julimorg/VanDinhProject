package com.example.common.dto.color.response;

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
public class GetListAlbumRes {

    private String albumId;

    private String albumName;

    private String description;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

}
