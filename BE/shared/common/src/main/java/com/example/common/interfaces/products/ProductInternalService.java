package com.example.common.interfaces.products;

import com.example.persistence.entity.Color;
import com.example.persistence.entity.Product;

public interface ProductInternalService {

    void  validateProductExistById(String productId);

    Product getProductById(String productId);

}
