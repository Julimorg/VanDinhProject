package com.example.common.interfaces.category;

import com.example.common.dto.search.CategoryIndexData;
import com.example.persistence.entity.Category;
import java.util.List;

public interface CategoryInternalService {

    void validateCategoryExists(String categoryId);

    Category getCategory(String categoryId);

    List<CategoryIndexData> fetchCategoriesForIndex();
}
