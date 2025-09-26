package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Product.CreateProductReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductReq;
import com.example.managementapi.Dto.Response.Product.CreateProductRes;
import com.example.managementapi.Dto.Response.Product.GetProductsRes;
import com.example.managementapi.Dto.Response.Product.ProductRes;
import com.example.managementapi.Dto.Response.Product.UpdateProductRes;
import com.example.managementapi.Dto.Response.Supplier.UpdateSupplierRes;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "productImage", ignore = true)
    Product toProduct(CreateProductReq request);

    //get 1 product
    ProductRes toProductResponse(Product product);

    CreateProductRes toCreateProductResponse(Product product);

    //get list product
    @Mapping(source = "supplier.supplierName", target = "supplierName")
    @Mapping(source = "color.colorName", target = "colorName")
    @Mapping(source = "category.categoryName", target = "categoryName")
    GetProductsRes toGetProductsResponses(Product products);

    //Req
    @Mapping(target = "productImage", ignore = true)
    void updateProduct(@MappingTarget Product product, UpdateProductReq request);


    UpdateProductRes toUpdateProductRes(Product product);
    //xong bài #5

}
