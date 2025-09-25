package com.example.managementapi.Dto.Request.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCategoryReq {
    private String categoryName;
    private String categoryDescription;
    private MultipartFile categoryImage;
}
