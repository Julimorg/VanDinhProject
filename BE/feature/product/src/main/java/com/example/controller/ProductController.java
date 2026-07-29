package com.example.controller;
import com.example.common.dto.ImportExcelFile.Response.ImportSummaryRes;
import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.request.UpdateProductQuantityReq;
import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.common.service.ExcelImportService;
import com.example.common.util.QRGenerateUtil;
import com.example.service.ProductImportService;
import com.example.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/products")
public class ProductController {

    private final ProductService productService;

    private final ExcelImportService excelImportService;

    private final ProductImportService productImportService;


    @PostMapping(value = "/import-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ImportSummaryRes> importProductsFromExcel(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<ImportSummaryRes>builder()
                .status_code(SuccessCode.IMPORT_PRODUCT_EXCEL_FILE.getStatusCode().value())
                .message(SuccessCode.IMPORT_PRODUCT_EXCEL_FILE.getMessage())
                .data(excelImportService.importExcel(file, productImportService))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/import-template")
    public ApiResponse<byte[]> downloadImportTemplate() {
        return ApiResponse.<byte[]>builder()
                .status_code(SuccessCode.IMPORT_TEMPLATE.getStatusCode().value())
                .message(SuccessCode.IMPORT_TEMPLATE.getMessage())
                .data(excelImportService.generateTemplate(productImportService))
                .build();
    }

    @GetMapping("/select-products")
    public ApiResponse<List<GetProductSelectionRes>> getProductSelection(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryName", required = false) String categoryName,
            @RequestParam(value = "supplierName", required = false) String supplierName,
            @RequestParam(value = "productType", required = false) String productType,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice
    ) {
        return ApiResponse.<List<GetProductSelectionRes>>builder()
                .status_code(SuccessCode.GET_PRODUCT_SELECTION.getStatusCode().value())
                .message(SuccessCode.GET_PRODUCT_SELECTION.getMessage())
                .data(productService.getProductSelection(
                        keyword,
                        categoryName,
                        supplierName,
                        productType,
                        minPrice,
                        maxPrice)
                )
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/new-arrival")
    ApiResponse<List<ProductNewArrivalRes>> getProductNewArrival(){
        return ApiResponse.<List<ProductNewArrivalRes>>builder()
                .status_code(SuccessCode.GET_PRODUCT_NEW_ARRIVAL.getStatusCode().value())
                .message(SuccessCode.GET_PRODUCT_NEW_ARRIVAL.getMessage())
                .data(productService.getProductNewArrival())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping(value = "/create-product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<CreateProductRes> createProduct(@ModelAttribute CreateProductReq request){
        return ApiResponse.<CreateProductRes>builder()

                .status_code(SuccessCode.CREATE_PRODUCT.getStatusCode().value())
                .message(SuccessCode.CREATE_PRODUCT.getMessage())
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
            @RequestParam(value = "productType", required = false) String productType,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice){

        return ApiResponse.<Page<GetProductsRes>>builder()
                .status_code(SuccessCode.GET_PRODUCT.getStatusCode().value())
                .message(SuccessCode.GET_PRODUCT.getMessage())
                .data(productService.getProducts(
                        keyword, categoryName, supplierName,productType, minPrice, maxPrice, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/detail-product/{productId}")
    ApiResponse<ProductRes> getProductById(@PathVariable("productId") String productId){
        return ApiResponse.<ProductRes>builder()

                .status_code(SuccessCode.GET_PRODUCT_NEW_ARRIVAL.getStatusCode().value())
                .message(SuccessCode.GET_SUPPLIER_DETAIL.getMessage())
                .data(productService.getProductById(productId))
                .timestamp(LocalDateTime.now())
                .build();

    }

    @PatchMapping(value = "/update/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<UpdateProductRes> updateProduct(@PathVariable String productId,
                                                @ModelAttribute UpdateProductReq request){
        return ApiResponse.<UpdateProductRes>builder()

                .status_code(SuccessCode.UPDATE_PRODUCT.getStatusCode().value())
                .message(SuccessCode.UPDATE_PRODUCT.getMessage())
                .data(productService.updateProduct(productId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping(value = "update-quantity/{productId}")
    ApiResponse<UpdateProductQuantityRes> updateProductQuantity(@PathVariable String productId,
                                                                @RequestBody UpdateProductQuantityReq request){
        return ApiResponse.<UpdateProductQuantityRes>builder()
                .status_code(SuccessCode.UPDATE_PRODUCT_QUANTITY.getStatusCode().value())
                .message(SuccessCode.UPDATE_PRODUCT_QUANTITY.getMessage())
                .data(productService.updateProductQuantity(productId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/delete/{productId}")
    ApiResponse<String> deleteProduct(@PathVariable String productId){
        productService.deleteProduct(productId);

        return ApiResponse.<String>builder()
                .status_code(SuccessCode.DELETE_PRODUCT.getStatusCode().value())
                .message(SuccessCode.DELETE_PRODUCT.getMessage())
                .data("Delete product successfully")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/generate-qr/{productId}")
    public ApiResponse<String> generateProductQr(@PathVariable String productId) {
        ProductRes product = productService.getProductById(productId);

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
