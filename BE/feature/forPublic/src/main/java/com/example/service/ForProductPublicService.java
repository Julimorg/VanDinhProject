package com.example.service;

import com.example.common.dto.product.response.GetProductsRes;
import com.example.common.dto.product.response.ProductNewArrivalRes;
import com.example.common.dto.product.response.ProductRes;
import com.example.common.interfaces.products.ProductServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ForProductPublicService {

    private final ProductServiceInterface productService;

    public List<ProductNewArrivalRes> getProductNewArrival() {
        return productService.getProductNewArrival();
    }

    public Page<GetProductsRes> getProducts(String keyword,
                                            String categoryName,
                                            String supplierName,
                                            Double minPrice,
                                            Double maxPrice,
                                            Pageable pageable) {
        return productService.getProducts(
                keyword,
                categoryName,
                supplierName,
                minPrice,
                maxPrice,
                pageable
        );
    }

    public ProductRes getProductById(String productId) {
        return productService.getProductById(productId);
    }

}
