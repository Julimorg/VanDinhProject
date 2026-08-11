package com.example.common.dto.color.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAlbumReq {

    @NotBlank(message = "Album name can not be blank!")
    private String albumName;

    private String description;

}
