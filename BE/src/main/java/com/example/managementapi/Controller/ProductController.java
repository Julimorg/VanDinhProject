package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Product.CreateProductReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductQuantityReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductReq;
import com.example.managementapi.Dto.Response.Product.*;
import com.example.managementapi.Service.ProductService;
import com.example.managementapi.Util.QRGenerateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/products")
public class ProductController {

    private final ProductService productService;


    @GetMapping("/select-products")
    public ApiResponse<List<GetProductSelectionRes>> getProductSelection(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryName", required = false) String categoryName,
            @RequestParam(value = "supplierName", required = false) String supplierName,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice
    ) {
        return ApiResponse.<List<GetProductSelectionRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(productService.getProductSelection(keyword, categoryName, supplierName, minPrice, maxPrice))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/new-arrival")
    ApiResponse<List<ProductNewArrivalRes>> getProductNewArrival(){
        return ApiResponse.<List<ProductNewArrivalRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(productService.getProductNewArrival())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping(value = "/create-product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<CreateProductRes> createProduct(@ModelAttribute CreateProductReq request){
        return ApiResponse.<CreateProductRes>builder()

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(productService.createProduct(request))
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
                .data(productService.getProducts(keyword, categoryName, supplierName, minPrice, maxPrice, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/detail-product/{productId}")
    ApiResponse<ProductRes> getProduct(@PathVariable("productId") String productId){
        return ApiResponse.<ProductRes>builder()

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(productService.getProduct(productId))
                .timestamp(LocalDateTime.now())
                .build();

    }

    @PatchMapping(value = "/update/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UpdateProductRes> updateProduct(@PathVariable("productId") String productId, @ModelAttribute UpdateProductReq request){
        return ApiResponse.<UpdateProductRes>builder()

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(productService.updateProduct(productId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping(value = "update-quantity/{productId}")
    ApiResponse<UpdateProductQuantityRes> updateProductQuantity(@PathVariable("productId") String productId, @RequestBody UpdateProductQuantityReq request){
        return ApiResponse.<UpdateProductQuantityRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(productService.updateProductQuantity(productId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/delete/{productId}")
    ApiResponse<String> deleteProduct(@PathVariable("productId") String productId){
        productService.deleteProduct(productId);

        return ApiResponse.<String>builder()

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data("Delete product successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/generate-qr/{productId}")
    public ApiResponse<String> generateProductQr(@PathVariable String productId) {
        ProductRes product = productService.getProduct(productId);

        String productJson = new QRGenerateUtil().prettyObject(product);

        String qrCodeBase64 = QRGenerateUtil.generateQrCode(productJson, 300, 300);

        return ApiResponse.<String>builder()

                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(qrCodeBase64)
                .timestamp(LocalDateTime.now())
                .build();
    }


}
