package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Category.CreateCategoryReq;
import com.example.managementapi.Dto.Request.Category.UpdateCategoryReq;
import com.example.managementapi.Dto.Response.Category.CreateCategoryRes;
import com.example.managementapi.Dto.Response.Category.GetCategoriesRes;
import com.example.managementapi.Dto.Response.Category.GetCategoriesSelectionRes;
import com.example.managementapi.Dto.Response.Category.GetDetailCategoryRes;
import com.example.managementapi.Dto.Response.Category.UpdateCategoryRes;
import com.example.managementapi.Entity.Category;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:48+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public GetCategoriesRes toGetCategoriesRes(Category categories) {
        if ( categories == null ) {
            return null;
        }

        GetCategoriesRes.GetCategoriesResBuilder getCategoriesRes = GetCategoriesRes.builder();

        getCategoriesRes.categoryDescription( categories.getCategoryDescription() );
        getCategoriesRes.categoryId( categories.getCategoryId() );
        getCategoriesRes.categoryImage( categories.getCategoryImage() );
        getCategoriesRes.categoryName( categories.getCategoryName() );
        getCategoriesRes.createAt( categories.getCreateAt() );
        getCategoriesRes.updateAt( categories.getUpdateAt() );

        return getCategoriesRes.build();
    }

    @Override
    public GetCategoriesSelectionRes toGetCategoriesSelectionRes(Category categories) {
        if ( categories == null ) {
            return null;
        }

        GetCategoriesSelectionRes.GetCategoriesSelectionResBuilder getCategoriesSelectionRes = GetCategoriesSelectionRes.builder();

        getCategoriesSelectionRes.categoryId( categories.getCategoryId() );
        getCategoriesSelectionRes.categoryName( categories.getCategoryName() );

        return getCategoriesSelectionRes.build();
    }

    @Override
    public GetDetailCategoryRes toGetDetailCategoryRes(Category category) {
        if ( category == null ) {
            return null;
        }

        GetDetailCategoryRes.GetDetailCategoryResBuilder getDetailCategoryRes = GetDetailCategoryRes.builder();

        getDetailCategoryRes.categoryDescription( category.getCategoryDescription() );
        getDetailCategoryRes.categoryId( category.getCategoryId() );
        getDetailCategoryRes.categoryImage( category.getCategoryImage() );
        getDetailCategoryRes.categoryName( category.getCategoryName() );
        getDetailCategoryRes.createAt( category.getCreateAt() );
        getDetailCategoryRes.updateAt( category.getUpdateAt() );

        return getDetailCategoryRes.build();
    }

    @Override
    public Category toCategory(CreateCategoryReq request) {
        if ( request == null ) {
            return null;
        }

        Category.CategoryBuilder category = Category.builder();

        category.categoryDescription( request.getCategoryDescription() );
        category.categoryName( request.getCategoryName() );

        return category.build();
    }

    @Override
    public CreateCategoryRes toCreateCategoryRes(Category category) {
        if ( category == null ) {
            return null;
        }

        CreateCategoryRes.CreateCategoryResBuilder createCategoryRes = CreateCategoryRes.builder();

        createCategoryRes.categoryDescription( category.getCategoryDescription() );
        createCategoryRes.categoryId( category.getCategoryId() );
        createCategoryRes.categoryImage( category.getCategoryImage() );
        createCategoryRes.categoryName( category.getCategoryName() );
        createCategoryRes.createAt( category.getCreateAt() );

        return createCategoryRes.build();
    }

    @Override
    public void updateCategory(Category category, UpdateCategoryReq request) {
        if ( request == null ) {
            return;
        }

        category.setCategoryDescription( request.getCategoryDescription() );
        category.setCategoryName( request.getCategoryName() );
    }

    @Override
    public UpdateCategoryRes toUpdateCategoryRes(Category category) {
        if ( category == null ) {
            return null;
        }

        UpdateCategoryRes.UpdateCategoryResBuilder updateCategoryRes = UpdateCategoryRes.builder();

        updateCategoryRes.categoryDescription( category.getCategoryDescription() );
        updateCategoryRes.categoryId( category.getCategoryId() );
        updateCategoryRes.categoryImage( category.getCategoryImage() );
        updateCategoryRes.categoryName( category.getCategoryName() );
        updateCategoryRes.updateAt( category.getUpdateAt() );

        return updateCategoryRes.build();
    }
}
