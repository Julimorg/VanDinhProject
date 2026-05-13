package com.example.common.service;

import com.cloudinary.Cloudinary;
import com.example.common.util.FileUpLoadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final CloudinaryService cloudinaryService;

    public String uploadImageIfPresent(MultipartFile image, String fileNamePrefix) {
        if (image == null || image.isEmpty()) return null;

        FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
        String fileName = FileUpLoadUtil.getFileName(fileNamePrefix);
        return cloudinaryService.uploadFile(image, fileName).getUrl();
    }
}
