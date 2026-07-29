package com.example.service;

import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.request.UpdateProductQuantityReq;
import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.*;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.category.CategoryQueryInternalService;
import com.example.common.interfaces.color.ColorQueryInternalService;
import com.example.common.interfaces.products.ProductQueryInternalService;
import com.example.common.interfaces.products.ProductServiceInterface;
import com.example.common.interfaces.supplier.SupplierQueryInternalService;
import com.example.common.service.FileUploadService;
import com.example.config.ProductSpecification;
import com.example.mapper.ProductMapper;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.PaintDetail;
import com.example.persistence.entity.Product;
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
public class ProductService implements ProductServiceInterface {

    private final ProductRepository productRepository;

    private final ProductMapper  productMapper;

    private final ProductQueryInternalService productQueryInternalService;

    private final FileUploadService fileUploadService;

    private final ApplicationEventPublisher publisher;

    private final ProductSelfTypeService productSelfTypeService;

    private final ProductHelpClassService productHelpClassService;

    @Override
    public List<ProductNewArrivalRes> getProductNewArrival() {

        var products = productQueryInternalService.findTop10ByOrderByCreateAtDesc();

        return products
                .stream()
                .map(product -> productMapper.toGetProductNewArrivalRes(product))
                .toList();
    }

    @Override
    public List<GetProductSelectionRes> getProductSelection(String keyword,
                                                            String categoryName,
                                                            String supplierName,
                                                            String productType,
                                                            Double minPrice,
                                                            Double maxPrice) {
        Specification<Product> specification = ProductSpecification.from(
                ProductSpecification.ProductFilter.full(
                        keyword,
                        categoryName,
                        supplierName,
                        productType,
                        minPrice,
                        maxPrice
                )
        );
        return productRepository.findAll(specification)
                .stream()
                .map(productMapper::toGetProductSelection)
                .toList();
    }

    @Override
    public Page<GetProductsRes> getProducts(String keyword,
                                            String categoryName,
                                            String supplierName,
                                            String productType,
                                            Double minPrice,
                                            Double maxPrice,
                                            Pageable pageable) {
        Specification<Product> specification = ProductSpecification.from(
                ProductSpecification.ProductFilter.full(
                        keyword,
                        categoryName,
                        supplierName,
                        productType,
                        minPrice,
                        maxPrice
                )
        );

        return productRepository.findAll(specification, pageable).map(productMapper::toGetProductsResponses);
    }

    @Override
    public ProductRes getProductById(String id){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        ProductRes response = productMapper.toProductResponse(product);

        if (product.getSupplier() != null) {
            response.setSupplierName(product.getSupplier().getSupplierName());
        }

        if (product.getCategory() != null) {
            response.setCategoryName(product.getCategory().getCategoryName());
        }

        productSelfTypeService.attachDetailByType(product, response);

        return response;
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateProductRes createProduct(CreateProductReq request) {

        if (request.getProductQuantity() > 10000000 ) {
            throw new AppException(ErrorCode.PRODUCT_EXCEED_LIMIT);
        }else if( request.getProductQuantity() <= 0) {
            throw new AppException(ErrorCode.PRODUCT_QUANTITY_CAN_NOT_BE_NEGATIVE);
        }

        if (productRepository.existsByProductCode(request.getProductCode())) {
            throw new RuntimeException(
                    ErrorCode.PRODUCT_CODE_DUPLICATED + request.getProductCode());
        }

        if (productRepository.existsByProductName(request.getProductName())) {
            throw new AppException(ErrorCode.PRODUCT_EXISTED);
        }

        Product product = productMapper.toCreateProduct(request);

        List<String> imageUrls = new ArrayList<>();

        if (request.getProductImage() != null && request.getProductImage().length > 0) {
            for (MultipartFile file : request.getProductImage()) {
                String url = fileUploadService
                        .uploadImageIfPresent(
                                file,
                                request.getProductName()
                        );
                if (url != null) {
                    imageUrls.add(url);
                }
            }
        }

        productHelpClassService.checkSupplierCategoryAndSetThemIntoProduct(
                product,
                request.getSupplierId(),
                request.getCategoryId()
        );

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

        if (savedProduct.getSupplier() != null) {
            response.setSupplierName(savedProduct.getSupplier().getSupplierName());
        }

        if (savedProduct.getCategory() != null) {
            response.setCategoryName(savedProduct.getCategory().getCategoryName());
        }

        return switch (request.getProductType()) {
            case PAINT    -> productSelfTypeService.createPaintProduct(product, request);
            case TOOL     -> productSelfTypeService.createToolProduct(product, request);
            case CHEMICAL -> productSelfTypeService.createChemicalProduct(product, request);
        };
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateProductRes updateProduct(String productId,
                                          UpdateProductReq request){

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (request.getProductQuantity() > 10000000 ) {
            throw new AppException(ErrorCode.PRODUCT_EXCEED_LIMIT);

        }else if( request.getProductQuantity() <= 0) {
            throw new AppException(ErrorCode.PRODUCT_QUANTITY_CAN_NOT_BE_NEGATIVE);
        }

        productMapper.updateProduct(product, request);


        List<String> imageUrls = productHelpClassService.uploadImages(request);

        if (!imageUrls.isEmpty()) {
            product.setProductImage(imageUrls);
        }

        productMapper.updateProduct(product, request);

        productSelfTypeService.updateDetailByType(product, request);

        productHelpClassService.checkSupplierCategoryAndSetThemIntoProduct(
                product,
                request.getSupplierId(),
                request.getCategoryId()
        );

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

        return productMapper.toUpdateProductRes(savedProduct);

    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateProductQuantityRes updateProductQuantity(String id,
                                                          UpdateProductQuantityReq request){
        Product product = productRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));


        if (request.getProductQuantity() < 0) {
            throw new RuntimeException(ErrorCode.PRODUCT_QUANTITY_CAN_NOT_BE_NEGATIVE + product.getProductName() );
        }

        productMapper.updateProductQuantity(product, request);

        return productMapper.toUpdateProductQuantityRes(productRepository.save(product));
    }

    @Override
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
