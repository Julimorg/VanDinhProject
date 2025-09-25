package com.example.managementapi.Service;

import com.cloudinary.Cloudinary;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Transactional
    public CloudinaryRes uploadFile(MultipartFile file, String fileName) {
        try {
            //? Gọi API của Cloudinary để upload File
            //? file.getBytes() --> Config file thành byte
            //? Map.of("public_id", "img" + fileName) --> Config định dạng file trên cloudinary
            //? result sẽ response về theo kiểu như sau
            //?     -> result = https://res.cloudinary.com/.../imgYELLOW_2025-08-23.png
            final Map result = cloudinary
                    .uploader()
                    .upload(file.getBytes(), Map.of("public_id", "img" + fileName));

            //? gán result ( ép kiểu result thành String ) cho url
            final String url = (String) result.get("secure_url");
            // ? gán public_id resposne từ Cloudinary cho publicId
            final String publicId = (String) result.get("public_id");

            //? Khi lấy được những data cần thiết từ response của Cloudinary
            //?     Build CloudinaryRes đã tạo trong DTO rồi gán các data đó vào các file của DTO
            return CloudinaryRes
                    .builder()
                    .publicId(publicId)
                    .url(url)
                    .build();
        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error during file upload: {}", e.getMessage(), e);
            throw new RuntimeException("Unexpected error during file upload: " + e.getMessage(), e);
        }
    }
}