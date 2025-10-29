package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Category.CreateCategoryReq;
import com.example.managementapi.Dto.Request.Category.UpdateCategoryReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductReq;
import com.example.managementapi.Dto.Response.Category.*;
import com.example.managementapi.Dto.Response.Product.UpdateProductRes;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    //* =========================== GET MAPPER ===========================
    GetCategoriesRes toGetCategoriesRes(Category categories);

    GetCategoriesSelectionRes toGetCategoriesSelectionRes(Category categories);

    GetDetailCategoryRes toGetDetailCategoryRes(Category category);

    //* =========================== CREATE MAPPER ===========================

    @Mapping(target = "categoryImage", ignore = true)
    Category toCategory(CreateCategoryReq request);

    CreateCategoryRes toCreateCategoryRes(Category category);

    //* =========================== UPDATE MAPPER ===========================
    @Mapping(target = "categoryImage", ignore = true)
    void updateCategory(@MappingTarget Category category, UpdateCategoryReq request);

    UpdateCategoryRes toUpdateCategoryRes(Category category);

}
