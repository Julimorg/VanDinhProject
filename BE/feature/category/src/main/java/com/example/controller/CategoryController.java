package com.example.controller;

import com.example.common.dto.category.request.CreateCategoryReq;
import com.example.common.dto.category.request.UpdateCategoryReq;
import com.example.common.dto.category.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping(value = "/create-category", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<CreateCategoryRes> createCategory(@ModelAttribute CreateCategoryReq request){
        return ApiResponse.<CreateCategoryRes>builder()
                .status_code(SuccessCode
                        .CREATE_CATEGORY
                        .getStatusCode()
                        .value())
                .message(SuccessCode
                        .CREATE_CATEGORY
                        .getMessage())
                .data(categoryService.createCategory(request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping(value = "/update/{categoryId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UpdateCategoryRes> updateCategory(@PathVariable String categoryId,
                                                  @ModelAttribute UpdateCategoryReq request){
        return ApiResponse.<UpdateCategoryRes>builder()
                .status_code(SuccessCode.UPDATE_CATEGORY.getStatusCode().value())
                .message(SuccessCode.UPDATE_CATEGORY.getMessage())
                .data(categoryService.updateCategory(categoryId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/select-categories")
    ApiResponse<List<GetCategoriesSelectionRes>> getCategoriesSelection(){
        return ApiResponse.<List<GetCategoriesSelectionRes>>builder()
                .status_code(SuccessCode.GET_CATEGORY_SELECTION.getStatusCode().value())
                .message(SuccessCode.GET_CATEGORY_SELECTION.getMessage())
                .data(categoryService.getCategoriesSelection())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-categories")
    ApiResponse<Page<GetCategoriesRes>> getCategories(
            @PageableDefault(size = 10, sort = "categoryName", direction = Sort.Direction.ASC)
            Pageable pageable,
            @RequestParam(required = false) String keyword){

        return ApiResponse.<Page<GetCategoriesRes>>builder()
                .status_code(SuccessCode.GET_CATEGORY.getStatusCode().value())
                .message(SuccessCode.GET_CATEGORY.getMessage())
                .data(categoryService.getCategories(pageable, keyword))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/detail-category/{categoryId}")
    ApiResponse<GetDetailCategoryRes> getCategory(@PathVariable String categoryId){
        return ApiResponse.<GetDetailCategoryRes>builder()
                .status_code(SuccessCode.GET_CATEGORY_DETAIL.getStatusCode().value())
                .message(SuccessCode.GET_CATEGORY_DETAIL.getMessage())
                .data(categoryService.getCategory(categoryId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("delete/{categoryId}")
    ApiResponse<String> deleteCategory(@PathVariable String categoryId){
        categoryService.deleteCategory(categoryId);

        return ApiResponse.<String>builder()
                .status_code(SuccessCode.DELETE_CATEGORY.getStatusCode().value())
                .message(SuccessCode.DELETE_CATEGORY.getMessage())
                .data("Delete category successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }


}
