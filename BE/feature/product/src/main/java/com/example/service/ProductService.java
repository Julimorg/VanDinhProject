package com.example.service;

import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.request.UpdateProductQuantityReq;
import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.*;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.category.CategoryInternalService;
import com.example.common.interfaces.color.ColorInternalService;
import com.example.common.interfaces.supplier.SupplierInternalService;
import com.example.common.service.FileUploadService;
import com.example.config.ProductSpecification;
import com.example.mapper.ProductMapper;
import com.example.persistence.entity.Category;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.Product;
import com.example.persistence.entity.Supplier;
import com.example.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.context.ApplicationEventPublisher;
import com.example.common.events.search.SearchIndexEvent;
import com.example.common.events.search.SearchDeleteEvent;

import java.util.ArrayList;
import java.util.List;


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

    private final ApplicationEventPublisher publisher;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public List<ProductNewArrivalRes> getProductNewArrival(){
        var products = productRepository.findTop10ByOrderByCreateAtDesc();

        return products
                .stream()
                .map(product -> productMapper.toGetProductNewArrivalRes(product))
                .toList();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public List<GetProductSelectionRes> getProductSelection(String keyword,
                                                            String categoryName,
                                                            String supplierName,
                                                            Double minPrice,
                                                            Double maxPrice) {
        Specification<Product> specification = ProductSpecification.from(
                ProductSpecification.ProductFilter.full(
                        keyword,
                        categoryName,
                        supplierName,
                        minPrice,
                        maxPrice
                )
        );
        return productRepository.findAll(specification)
                .stream()
                .map(productMapper::toGetProductSelection)
                .toList();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public Page<GetProductsRes> getProducts(String keyword,
                                            String categoryName,
                                            String supplierName,
                                            Double minPrice,
                                            Double maxPrice,
                                            Pageable pageable) {
        Specification<Product> specification = ProductSpecification.from(
                ProductSpecification.ProductFilter.full(
                        keyword,
                        categoryName,
                        supplierName,
                        minPrice,
                        maxPrice
                )
        );

        return productRepository.findAll(specification, pageable).map(productMapper::toGetProductsResponses);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public ProductRes getProductById(String id){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        ProductRes response = productMapper.toProductResponse(product);

        if (product.getSupplier() != null) {
            response.setSupplierName(product.getSupplier().getSupplierName());
        }

        if(product.getColor() != null){
            response.setColorName(product.getColor().getColorName());
        }

        if(product.getCategory() != null){
            response.setCategoryName(product.getCategory().getCategoryName());
        }

        return response;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateProductRes createProduct(CreateProductReq request) {

        if (productRepository.existsByProductName(request.getProductName())) {
            throw new AppException(ErrorCode.PRODUCT_EXISTED);
        }

        Product product = productMapper.toProduct(request);

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierInternalService
                    .getSupplierById(request
                            .getSupplierId());
            product.setSupplier(supplier);
        }

        if (request.getColorId() != null) {
            Color color = colorInternalService
                    .getColorById(request
                            .getColorId());
            product.setColor(color);
        }

        if (request.getCategoryId() != null) {
            Category category = categoryInternalService
                    .getCategory(request
                            .getCategoryId());
            product.setCategory(category);
        }

        if (request.getProductQuantity() > 10000000) {
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

        String image = (savedProduct.getProductImage() != null && !savedProduct.getProductImage().isEmpty())
                ? savedProduct.getProductImage().getFirst()
                : "https://placehold.net/default.png";

        publisher.publishEvent(SearchIndexEvent.builder()
                .id("P_" + savedProduct.getProductId())
                .type("PRODUCT")
                .entityId(savedProduct.getProductId())
                .name(savedProduct.getProductName())
                .image(image)
                .price(savedProduct.getProductPrice())
                .build());

        CreateProductRes response = productMapper.toCreateProductResponse(savedProduct);

        //Có thể dùng @Mapper để trả về supplierName, colorName, categoryName trong Mapper thay vì set trong service
        if (savedProduct.getSupplier() != null) {
            response.setSupplierName(savedProduct.getSupplier().getSupplierName());
        }

        if (savedProduct.getColor() != null) {
            response.setColorName(savedProduct.getColor().getColorName());
        }

        if (savedProduct.getCategory() != null) {
            response.setCategoryName(savedProduct.getCategory().getCategoryName());
        }

        return response;
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateProductRes updateProduct(String productId,
                                          UpdateProductReq request){


        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        MultipartFile[] images = request.getProductImage();

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : request.getProductImage()) {
            String url = fileUploadService.uploadImageIfPresent(file, request.getProductName());
            if (url != null) {
                imageUrls.add(url);
            }
        }

        productMapper.updateProduct(product, request);

        product.setProductImage(imageUrls);

        Product savedProduct = productRepository.save(product);

        // TODO
        //   CONFIG ELASTICSEARCH
        //   elasticSearchService.saveProduct(savedProduct);

        String image = (savedProduct.getProductImage() != null && !savedProduct.getProductImage().isEmpty())
                ? savedProduct.getProductImage().getFirst()
                : "https://placehold.net/default.png";

        publisher.publishEvent(SearchIndexEvent.builder()
                .id("P_" + savedProduct.getProductId())
                .type("PRODUCT")
                .entityId(savedProduct.getProductId())
                .name(savedProduct.getProductName())
                .image(image)
                .price(savedProduct.getProductPrice())
                .build());

        UpdateProductRes response = productMapper.toUpdateProductRes(savedProduct);

        if (savedProduct.getSupplier() != null) {
            response.setSupplierName(savedProduct.getSupplier().getSupplierName());
        }

        if(savedProduct.getColor() != null){
            response.setColorName(savedProduct.getColor().getColorName());
        }

        if(savedProduct.getCategory() != null){
            response.setCategoryName(savedProduct.getCategory().getCategoryName());
        }

        return response;

    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")

    public UpdateProductQuantityRes updateProductQuantity(String id,
                                                          UpdateProductQuantityReq request){
        if (request.getProductQuantity() < 0) {
            throw new IllegalArgumentException("Quantity must be equal or higher than 0");
        }

        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

        productMapper.updateProductQuantity(product, request);

        return productMapper.toUpdateProductQuantityRes(productRepository.save(product));
    }

    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteProduct(String id){
        productRepository.deleteById(id);
        publisher.publishEvent(new SearchDeleteEvent("P_" + id));
        // TODO
        //  CONFIG ELASTICSEARCH
        //  elasticSearchService.delete("P_" + id);
    }
}
