package com.example.common.interfaces.products;

import com.example.persistence.entity.Color;
import com.example.persistence.entity.Product;

public interface ProductInternalService {

    void  validateProductExistById(String productId);

    void saveProductData(Product product);

    Product getProductById(String productId);

}
