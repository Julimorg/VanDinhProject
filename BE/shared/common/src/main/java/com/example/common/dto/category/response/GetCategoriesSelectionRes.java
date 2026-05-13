package com.example.common.dto.category.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetCategoriesSelectionRes {
    private String categoryId;
    private String categoryName;
}
