package com.example.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.dto.search.ProductIndexData;
import com.example.common.interfaces.products.ProductQueryInternalService;
import com.example.mapper.ProductMapper;
import com.example.persistence.entity.Product;
import com.example.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductInternalServiceImpl implements ProductQueryInternalService {

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    @Override
    public void validateProductExistById(String productId) {
        if (!productRepository.existsById(productId)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXIST);
        }
    }

    @Override
    public void saveProductData(Product product) {

        productRepository.save(product);
    }

    @Override
    public List<Product> findTop10ByOrderByCreateAtDesc() {
        return productRepository.findTop10ByOrderByCreateAtDesc();
    }

    @Override
    public List<Product> saveAllProductData(List<Product> products) {
       return productRepository.saveAll(products);
    }

    @Override
    public Product getProductById(String productId) {

        validateProductExistById(productId);

        Product product =  productRepository
                .findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        return productMapper.toGetProductByIdWithInterface(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductIndexData> fetchProductsForIndex() {
        return productRepository.findAll()
                .stream()
                .map(p -> {
                    String image = (p.getProductImage() != null && !p.getProductImage().isEmpty())
                            ? p.getProductImage().getFirst()
                            : "https://placehold.net/default.png";
                    return ProductIndexData.builder()
                            .id(p.getProductId())
                            .name(p.getProductName())
                            .image(image)
                            .price(p.getProductPrice())
                            .build();
                })
                .toList();
    }
}
