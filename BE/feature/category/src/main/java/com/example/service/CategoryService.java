package com.example.service;

import com.example.common.dto.category.request.CreateCategoryReq;
import com.example.common.dto.category.request.UpdateCategoryReq;
import com.example.common.dto.category.response.*;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.service.FileUploadService;
import com.example.config.CategorySpecification;
import com.example.mapper.CategoryMapper;
import com.example.persistence.entity.Category;
import com.example.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    private final FileUploadService fileUploadService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public List<GetCategoriesSelectionRes> getCategoriesSelection(){
        return categoryRepository
                .findAll()
                .stream()
                .map(categoryMapper::toGetCategoriesSelectionRes).toList();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public Page<GetCategoriesRes> getCategories(Pageable pageable, String keyword){
        Specification<Category> specification = CategorySpecification
                .from(CategorySpecification
                        .CategoryFilter
                        .keywordOnly(keyword)
        );
        return categoryRepository.findAll(specification, pageable)
                .map(categoryMapper::toGetCategoriesRes);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public GetDetailCategoryRes getCategory(String id){
        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        return categoryMapper.toGetDetailCategoryRes(category);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateCategoryRes createCategory(CreateCategoryReq request){

        if(categoryRepository.existsByCategoryName(request.getCategoryName())){
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }

        Category category = categoryMapper.toCategory(request);

        category.setCategoryImage(fileUploadService
                .uploadImageIfPresent(
                        request.getCategoryImage(),
                        request.getCategoryName())
        );

        category = categoryRepository.save(category);

        //  TODO
        //  CONFIG ELASTICSEARCH !
        //  elasticSearchService.saveCategory(category);

        return categoryMapper.toCreateCategoryRes(category);
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateCategoryRes updateCategory(String id, UpdateCategoryReq request){

        Category category = categoryRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setCategoryImage(fileUploadService
                .uploadImageIfPresent(
                        request.getCategoryImage(),
                        request.getCategoryName())
        );

        categoryMapper.updateCategory(category, request);

        category = categoryRepository.save(category);
        //  TODO
        //  CONFIG ELASTICSEARCH !
        //  elasticSearchService.saveCategory(category);

        return categoryMapper.toUpdateCategoryRes(category);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteCategory(String id){
        //  TODO
        //  CONFIG ELASTICSEARCH !
        //  elasticSearchService.delete("C_"+id);
        categoryRepository.deleteById(id);
    }

}
