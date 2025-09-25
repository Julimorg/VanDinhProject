package com.example.managementapi.Dto.Response.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetDetailCategoryRes {
    private String categoryId;
    private String categoryName;
    private String categoryDescription;
    private String categoryImage;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
