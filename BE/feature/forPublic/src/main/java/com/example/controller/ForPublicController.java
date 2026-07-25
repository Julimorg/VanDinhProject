package com.example.controller;

import com.example.common.dto.category.response.GetCategoriesRes;
import com.example.common.dto.category.response.GetCategoriesSelectionRes;
import com.example.common.dto.category.response.GetDetailCategoryRes;
import com.example.common.dto.color.GetColorRes;
import com.example.common.dto.color.GetColorWithSupplierRes;
import com.example.common.dto.product.response.GetProductsRes;
import com.example.common.dto.product.response.ProductNewArrivalRes;
import com.example.common.dto.product.response.ProductRes;
import com.example.common.dto.supplier.response.GetSupplierDetailRes;
import com.example.common.dto.supplier.response.GetSupplierRes;
import com.example.common.dto.supplier.response.GetSupplierSelectionRes;
import com.example.common.enums.SuccessCode;
import com.example.common.interfaces.category.CategoryServiceInterface;
import com.example.common.interfaces.color.ColorServiceInterface;
import com.example.common.interfaces.forPublic.ForProductPublicInterface;
import com.example.common.interfaces.products.ProductServiceInterface;
import com.example.common.interfaces.supplier.SupplierServiceInterface;
import com.example.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/for-public")
public class ForPublicController {

    private final ProductServiceInterface productInternalService;

    private final SupplierServiceInterface supplierServiceInterface;

    private final ColorServiceInterface colorServiceInterface;

    private final CategoryServiceInterface categoryServiceInterface;

    //* ============================ Category FEATURE ============================

    @GetMapping("/select-categories")
    ApiResponse<List<GetCategoriesSelectionRes>> getCategoriesSelection(){
        return ApiResponse.<List<GetCategoriesSelectionRes>>builder()
                .status_code(SuccessCode.GET_CATEGORY_SELECTION.getStatusCode().value())
                .message(SuccessCode.GET_CATEGORY_SELECTION.getMessage())
                .data(categoryServiceInterface.getCategoriesSelection())
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
                .data(categoryServiceInterface.getCategories(pageable, keyword))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/detail-category/{categoryId}")
    ApiResponse<GetDetailCategoryRes> getCategory(@PathVariable String categoryId){
        return ApiResponse.<GetDetailCategoryRes>builder()
                .status_code(SuccessCode.GET_CATEGORY_DETAIL.getStatusCode().value())
                .message(SuccessCode.GET_CATEGORY_DETAIL.getMessage())
                .data(categoryServiceInterface.getCategory(categoryId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    //* ============================ Color FEATURE ============================

    @GetMapping("/get-color")
    public ApiResponse<Page<GetColorRes>> getColor(
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "colorName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetColorRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully!")
                .data(colorServiceInterface.getColor(keyword, supplierName, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/color-selector/{supplierId}")
    public ApiResponse<List<GetColorWithSupplierRes>> getColorWithSupplier(@PathVariable String supplierId){
        return ApiResponse.<List<GetColorWithSupplierRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully!")
                .data(colorServiceInterface.getColorWithSupplier(supplierId ))
                .timestamp(LocalDateTime.now())
                .build();
    }


    //* ============================ Supplier FEATURE ============================

    @GetMapping("/select-suppliers")
    public ApiResponse<List<GetSupplierSelectionRes>> getSupplierSelection(
            @RequestParam(required = false) String keyword
    ){
        return ApiResponse.<List<GetSupplierSelectionRes>>
                        builder()
                .status_code(SuccessCode.GET_SUPPLIER_SELECTION.getStatusCode().value())
                .message(SuccessCode.GET_SUPPLIER_SELECTION.getMessage())
                .data(supplierServiceInterface.getSupplierSelection(keyword))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-suppliers")
    public ApiResponse<Page<GetSupplierRes>> getSupplier(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "supplierName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetSupplierRes>>builder()
                .status_code(SuccessCode.GET_SUPPLIER.getStatusCode().value())
                .message(SuccessCode.GET_SUPPLIER.getMessage())
                .data(supplierServiceInterface.getSuppliers(keyword, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/detail-supplier/{supplierId}")
    public ApiResponse<GetSupplierDetailRes> getSupplierDetail(@PathVariable String supplierId){
        return ApiResponse.<GetSupplierDetailRes>builder()
                .status_code(SuccessCode.GET_SUPPLIER_DETAIL.getStatusCode().value())
                .message(SuccessCode.GET_SUPPLIER_DETAIL.getMessage())
                .data(supplierServiceInterface.getSupplierDetailRes(supplierId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    //* ============================ PRODUCT FEATURE ============================
    @GetMapping("/new-arrival")
    ApiResponse<List<ProductNewArrivalRes>> getProductNewArrival(){
        return ApiResponse.<List<ProductNewArrivalRes>>builder()
                .status_code(SuccessCode.GET_PRODUCT_NEW_ARRIVAL.getStatusCode().value())
                .message(SuccessCode.GET_PRODUCT_NEW_ARRIVAL.getMessage())
                .data(productInternalService.getProductNewArrival())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-products")
    ApiResponse<Page<GetProductsRes>> getProducts(
            @PageableDefault(size = 10, sort = "createAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryName", required = false) String categoryName,
            @RequestParam(value = "supplierName", required = false) String supplierName,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice){

        return ApiResponse.<Page<GetProductsRes>>builder()
                .status_code(SuccessCode.GET_PRODUCT.getStatusCode().value())
                .message(SuccessCode.GET_PRODUCT.getMessage())
                .data(productInternalService.getProducts(
                        keyword,
                        categoryName,
                        supplierName,
                        minPrice,
                        maxPrice,
                        pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/detail-product/{productId}")
    ApiResponse<ProductRes> getProductById(@PathVariable("productId") String productId){
        return ApiResponse.<ProductRes>builder()

                .status_code(SuccessCode.GET_PRODUCT_NEW_ARRIVAL.getStatusCode().value())
                .message(SuccessCode.GET_SUPPLIER_DETAIL.getMessage())
                .data(productInternalService.getProductById(productId))
                .timestamp(LocalDateTime.now())
                .build();

    }


}
