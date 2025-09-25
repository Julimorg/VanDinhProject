package com.example.managementapi.Dto.Response.Cloudinary;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CloudinaryRes {

    //? CloudinaryRes sẽ response về 2 field public_id và url
    //? Nên việc tạo DTO để ứng response từ Api của Cloudinary là cần thiết

    private String publicId;

    private String url;
}
