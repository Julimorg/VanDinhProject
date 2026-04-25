package com.example.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.products.ProductInternalService;
import com.example.mapper.ProductMapper;
import com.example.persistence.entity.Product;
import com.example.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductInternalServiceImpl implements ProductInternalService {

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    @Override
    public void validateProductExistById(String productId) {
        if (!productRepository.existsById(productId)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXIST);
        }
    }

    @Override
    public Product getProductById(String productId) {

        validateProductExistById(productId);

        Product product =  productRepository
                .findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        return productMapper.toGetProductByIdWithInterface(product);
    }
}
