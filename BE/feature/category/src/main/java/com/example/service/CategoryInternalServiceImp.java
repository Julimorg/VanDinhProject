package com.example.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.category.CategoryInternalService;
import com.example.common.interfaces.supplier.SupplierInternalService;
import com.example.mapper.CategoryMapper;
import com.example.persistence.entity.Category;
import com.example.persistence.entity.Supplier;
import com.example.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryInternalServiceImp implements CategoryInternalService {

    private final CategoryRepository  categoryRepository;

    private final CategoryMapper categoryMapper;

    @Override
    public void validateCategoryExists(String categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
        }
    }

    @Override
    public Category getCategory(String categoryId) {

        validateCategoryExists(categoryId);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));


        return categoryMapper.toGetCategoryByIdWithInterface(category);
    }
}
