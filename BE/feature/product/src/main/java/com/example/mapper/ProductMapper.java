package com.example.mapper;

import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.request.UpdateProductQuantityReq;
import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.*;
import com.example.persistence.entity.Product;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    //* =========================== GET MAPPER ===========================

    ProductNewArrivalRes toGetProductNewArrivalRes(Product product);

    @Mapping(target = "productImage", ignore = true)
    Product toProduct(CreateProductReq request);

    @Mapping(source = "color.colorCode", target = "colorCode")
    ProductRes toProductResponse(Product product);

    @Mapping(source = "supplier.supplierName", target = "supplierName")
    @Mapping(source = "color.colorName", target = "colorName")
    @Mapping(source = "category.categoryName", target = "categoryName")
    GetProductsRes toGetProductsResponses(Product products);

    Product toGetProductByIdWithInterface(Product product);

    //* =========================== CREATE MAPPER ===========================

    CreateProductRes toCreateProductResponse(Product product);

    //* =========================== UPDATE MAPPER ===========================

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "productImage", ignore = true)
    void updateProduct(@MappingTarget Product product, UpdateProductReq request);

    UpdateProductRes toUpdateProductRes(Product product);

    @Mapping(source = "supplier.supplierName", target = "supplierName")
    GetProductSelectionRes toGetProductSelection(Product product);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "productQuantity", source = "productQuantity")
    void updateProductQuantity(@MappingTarget Product product, UpdateProductQuantityReq request);

    @Mapping(source = "supplier.supplierName", target = "supplierName")
    @Mapping(source = "color.colorName", target = "colorName")
    @Mapping(source = "category.categoryName", target = "categoryName")
    UpdateProductQuantityRes toUpdateProductQuantityRes(Product product);
}
