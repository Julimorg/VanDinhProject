package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Category.CreateCategoryReq;
import com.example.managementapi.Dto.Request.Category.UpdateCategoryReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductReq;
import com.example.managementapi.Dto.Response.Category.CreateCategoryRes;
import com.example.managementapi.Dto.Response.Category.GetCategoriesRes;
import com.example.managementapi.Dto.Response.Category.GetDetailCategoryRes;
import com.example.managementapi.Dto.Response.Category.UpdateCategoryRes;
import com.example.managementapi.Dto.Response.Product.UpdateProductRes;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "categoryImage", ignore = true)
    Category toCategory(CreateCategoryReq request);
    CreateCategoryRes toCreateCategoryRes(Category category);

    @Mapping(target = "categoryImage", ignore = true)
    void updateCategory(@MappingTarget Category category, UpdateCategoryReq request);
    UpdateCategoryRes toUpdateCategoryRes(Category category);

    GetCategoriesRes toGetCategoriesRes(Category categories);

    GetDetailCategoryRes toGetDetailCategoryRes(Category category);
}
