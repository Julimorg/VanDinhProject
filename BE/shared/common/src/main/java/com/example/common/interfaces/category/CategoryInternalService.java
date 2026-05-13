package com.example.common.interfaces.category;

import com.example.persistence.entity.Category;

public interface CategoryInternalService {

    void validateCategoryExists(String categoryId);

    Category getCategory(String categoryId);

}
