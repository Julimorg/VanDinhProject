package com.example.common.interfaces.products;

import com.example.persistence.entity.Color;
import com.example.persistence.entity.Product;

import java.util.List;

public interface ProductInternalService {

    void  validateProductExistById(String productId);

    void saveProductData(Product product);

    List<Product> saveAllProductData(List<Product> products);

    Product getProductById(String productId);

}
