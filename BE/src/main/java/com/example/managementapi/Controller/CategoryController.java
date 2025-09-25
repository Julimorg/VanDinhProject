package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Category.CreateCategoryReq;
import com.example.managementapi.Dto.Request.Category.UpdateCategoryReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductReq;
import com.example.managementapi.Dto.Response.Category.CreateCategoryRes;
import com.example.managementapi.Dto.Response.Category.GetCategoriesRes;
import com.example.managementapi.Dto.Response.Category.GetDetailCategoryRes;
import com.example.managementapi.Dto.Response.Category.UpdateCategoryRes;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping(value = "/create-category", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<CreateCategoryRes> createCategory(@ModelAttribute CreateCategoryReq request){
        return ApiResponse.<CreateCategoryRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(categoryService.createCategory(request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping(value = "/update/{categoryId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UpdateCategoryRes> updateCategory(@PathVariable("categoryId") String categoryId, @ModelAttribute UpdateCategoryReq request){
        return ApiResponse.<UpdateCategoryRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(categoryService.updateCategory(categoryId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-categories")
    ApiResponse<Page<GetCategoriesRes>> getCategories(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<GetCategoriesRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(categoryService.getCategories(pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/detail-category/{categoryId}")
    ApiResponse<GetDetailCategoryRes> getCategory(@PathVariable("categoryId") String categoryId){
        return ApiResponse.<GetDetailCategoryRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(categoryService.getCategory(categoryId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("delete/{categoryId}")
    ApiResponse<String> deleteCategory(@PathVariable("categoryId") String categoryId){
        categoryService.deleteCategory(categoryId);

        return ApiResponse.<String>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data("Delete category successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }


}
