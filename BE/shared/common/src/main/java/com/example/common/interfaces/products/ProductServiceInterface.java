package com.example.common.interfaces.products;

import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.request.UpdateProductQuantityReq;
import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface ProductServiceInterface {

    List<ProductNewArrivalRes> getProductNewArrival();


    List<GetProductSelectionRes> getProductSelection(String keyword,
                                                            String categoryName,
                                                            String supplierName,
                                                            Double minPrice,
                                                            Double maxPrice);

    Page<GetProductsRes> getProducts(String keyword,
                                            String categoryName,
                                            String supplierName,
                                            Double minPrice,
                                            Double maxPrice,
                                            Pageable pageable);

    ProductRes getProductById(String id);

    CreateProductRes createProduct(CreateProductReq request);


    UpdateProductRes updateProduct(String productId, UpdateProductReq request);

    UpdateProductQuantityRes updateProductQuantity(String id, UpdateProductQuantityReq request);

    void deleteProduct(String id);

}
