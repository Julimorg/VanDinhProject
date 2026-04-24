package com.example.service;

import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.response.CreateProductRes;
import com.example.common.dto.product.response.GetProductsRes;
import com.example.common.dto.product.response.ProductNewArrivalRes;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.category.CategoryInternalService;
import com.example.common.interfaces.color.ColorInternalService;
import com.example.common.interfaces.supplier.SupplierInternalService;
import com.example.common.service.FileUploadService;
import com.example.mapper.ProductMapper;
import com.example.persistence.entity.Category;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.Product;
import com.example.persistence.entity.Supplier;
import com.example.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

import static org.hibernate.internal.util.collections.ArrayHelper.forEach;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    private final ProductMapper  productMapper;

    private final SupplierInternalService supplierInternalService;

    private final ColorInternalService colorInternalService;

    private final CategoryInternalService categoryInternalService;

    private final FileUploadService fileUploadService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public List<ProductNewArrivalRes> getProductNewArrival(){
        var products = productRepository.findTop10ByOrderByCreateAtDesc();

        return products
                .stream()
                .map(product -> productMapper.toGetProductNewArrivalRes(product))
                .toList();
    }

//    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
//    public Page<GetProductsRes> getProducts(String keyword,
//                                            String categoryName,
//                                            String supplierName,
//                                            Double minPrice,
//                                            Double maxPrice,
//                                            Pageable pageable) {
//        Specification<Product> specification = ProductSpecification.searchFilterForProduct(
//                keyword,
//                categoryName,
//                supplierName,
//                minPrice,
//                maxPrice
//        );
//
//        return productRepository.findAll(specification, pageable).map(productMapper::toGetProductsResponses);
//    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateProductRes createProduct(CreateProductReq request){

        if(productRepository.existsByProductName(request.getProductName())){
            throw new AppException(ErrorCode.PRODUCT_EXISTED);
        }

        Product product = productMapper.toProduct(request);

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierInternalService
                    .getSupplierById(request
                            .getSupplierId());
            product.setSupplier(supplier);
        }

        if(request.getColorId() != null){
            Color color = colorInternalService
                    .getColorById(request
                            .getColorId());
            product.setColor(color);
        }

        if(request.getCategoryId() != null){
            Category category =  categoryInternalService
                    .getCategory(request
                            .getCategoryId());
            product.setCategory(category);
        }

        if(request.getProductQuantity() > 10000000){
            throw new AppException(ErrorCode.PRODUCT_EXCEED_LIMIT);
        }


        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : request.getProductImage()) {
            String url = fileUploadService.uploadImageIfPresent(file, request.getProductName());
            if (url != null) {
                imageUrls.add(url);
            }
        }

        product.setProductImage(imageUrls);

        Product savedProduct = productRepository.save(product);

        // TODO
        //  CONFIG ELASTICSEARCH
        //  elasticSearchService.saveProduct(savedProduct);

        CreateProductRes response = productMapper.toCreateProductResponse(savedProduct);

        //Có thể dùng @Mapper để trả về supplierName, colorName, categoryName trong Mapper thay vì set trong service
        if(savedProduct.getSupplier() != null){
            response.setSupplierName(savedProduct.getSupplier().getSupplierName());
        }

        if(savedProduct.getColor() != null){
            response.setColorName(savedProduct.getColor().getColorName());
        }

        if(savedProduct.getCategory() != null){
            response.setCategoryName(savedProduct.getCategory().getCategoryName());
        }

        return response;
//        product.setName(request.getName());
//        product.setDescription(request.getDescription());
//        product.setPrice(request.getPrice());
//        product.setStatus(request.getStatus());
//        product.setQuantity(request.getQuantity());
    }
}
