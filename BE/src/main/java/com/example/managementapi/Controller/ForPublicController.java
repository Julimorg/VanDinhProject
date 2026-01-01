package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Response.Category.GetCategoriesSelectionRes;
import com.example.managementapi.Dto.Response.Color.GetColorRes;
import com.example.managementapi.Dto.Response.Product.GetProductsRes;
import com.example.managementapi.Dto.Response.Product.ProductRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierSelectionRes;
import com.example.managementapi.Service.ForPublicService;
import com.example.managementapi.Service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/public")
@RequiredArgsConstructor
public class ForPublicController {

    private final ForPublicService forPublicService;

    @GetMapping("/select-suppliers")
    public ApiResponse<List<GetSupplierSelectionRes>> getSupplierSelection(){
        return ApiResponse.<List<GetSupplierSelectionRes>>
                        builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(forPublicService.getSupplierSelection())
                .timestamp(LocalDateTime.now())
                .build();
    }
    @GetMapping("/select-categories")
    ApiResponse<List<GetCategoriesSelectionRes>> getCategoriesSelection(){
        return ApiResponse.<List<GetCategoriesSelectionRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(forPublicService.getCategoriesSelection())
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

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(forPublicService.getProducts(keyword, categoryName, supplierName, minPrice, maxPrice, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/detail-product/{productId}")
    ApiResponse<ProductRes> getProduct(@PathVariable("productId") String productId){
        return ApiResponse.<ProductRes>builder()

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(forPublicService.getProduct(productId))
                .timestamp(LocalDateTime.now())
                .build();

    }

    @GetMapping("/get-suppliers")
    public ApiResponse<Page<GetSupplierRes>> getSupplier(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "supplierName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetSupplierRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(forPublicService.getSuppliers(keyword, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-color")
    public ApiResponse<Page<GetColorRes>> getColor(
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "colorName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetColorRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Successfully!")
                .data(forPublicService.getColor(keyword, supplierName, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

}
