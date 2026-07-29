package com.example.mapper;

import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.request.UpdateProductQuantityReq;
import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.*;
import com.example.persistence.entity.ChemicalDetail;
import com.example.persistence.entity.PaintDetail;
import com.example.persistence.entity.Product;
import com.example.persistence.entity.ToolDetail;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        uses = {
                PaintDetailMapper.class,
                ToolDetailMapper.class,
                ChemicalDetailMapper.class
        }
)
public interface ProductMapper {

    //* =========================== GET MAPPER ===========================

    @Mapping(target = "productId",     source = "product.productId")
    @Mapping(target = "paintDetail",   source = "paintDetail")
    @Mapping(target = "toolDetail",    ignore = true)
    @Mapping(target = "chemicalDetail",ignore = true)
    CreateProductRes toPaintResponse(Product product, PaintDetail paintDetail);

    @Mapping(target = "productId",     source = "product.productId")
    @Mapping(target = "paintDetail",   ignore = true)
    @Mapping(target = "toolDetail",    source = "toolDetail")
    @Mapping(target = "chemicalDetail",ignore = true)
    CreateProductRes toToolResponse(Product product, ToolDetail toolDetail);

    @Mapping(target = "productId",     source = "product.productId")
    @Mapping(target = "paintDetail",   ignore = true)
    @Mapping(target = "toolDetail",    ignore = true)
    @Mapping(target = "chemicalDetail",source = "chemicalDetail")
    CreateProductRes toChemicalResponse(Product product, ChemicalDetail chemicalDetail);

    ProductNewArrivalRes toGetProductNewArrivalRes(Product product);

    @Mapping(target = "productImage", ignore = true)
    Product toCreateProduct(CreateProductReq request);

//    @Mapping(source = "color.colorCode", target = "colorCode")
    ProductRes toProductResponse(Product product);

    @Mapping(source = "supplier.supplierName", target = "supplierName")
    @Mapping(source = "category.categoryName", target = "categoryName")
    GetProductsRes toGetProductsResponses(Product products);

    Product toGetProductByIdWithInterface(Product product);

    //* =========================== CREATE MAPPER ===========================

    CreateProductRes toCreateProductResponse(Product product);

    //* =========================== UPDATE MAPPER ===========================

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "productId",       ignore = true)
    @Mapping(target = "productType",     ignore = true)
    @Mapping(target = "productImage",    ignore = true)
    @Mapping(target = "supplier",        ignore = true)
    @Mapping(target = "category",        ignore = true)
    @Mapping(target = "createAt",        ignore = true)
    @Mapping(target = "updateAt",        ignore = true)
    void voidUpdateProduct (@MappingTarget Product product, UpdateProductReq request);

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
//    @Mapping(source = "color.colorName", target = "colorName")
    @Mapping(source = "category.categoryName", target = "categoryName")
    UpdateProductQuantityRes toUpdateProductQuantityRes(Product product);
}
