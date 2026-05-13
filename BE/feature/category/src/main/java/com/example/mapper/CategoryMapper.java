package com.example.mapper;

import com.example.common.dto.category.request.CreateCategoryReq;
import com.example.common.dto.category.request.UpdateCategoryReq;
import com.example.common.dto.category.response.*;
import com.example.persistence.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    //* =========================== GET MAPPER ===========================
    GetCategoriesRes toGetCategoriesRes(Category categories);

    GetCategoriesSelectionRes toGetCategoriesSelectionRes(Category categories);

    GetDetailCategoryRes toGetDetailCategoryRes(Category category);

    Category toGetCategoryByIdWithInterface(Category category);
    //* =========================== CREATE MAPPER ===========================

    @Mapping(target = "categoryImage", ignore = true)
    Category toCategory(CreateCategoryReq request);

    CreateCategoryRes toCreateCategoryRes(Category category);

    //* =========================== UPDATE MAPPER ===========================
    @Mapping(target = "categoryImage", ignore = true)
    void updateCategory(@MappingTarget Category category, UpdateCategoryReq request);

    UpdateCategoryRes toUpdateCategoryRes(Category category);

}
