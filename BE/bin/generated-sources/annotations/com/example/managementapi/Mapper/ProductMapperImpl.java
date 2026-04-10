package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Product.CreateProductReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductQuantityReq;
import com.example.managementapi.Dto.Request.Product.UpdateProductReq;
import com.example.managementapi.Dto.Response.Product.CreateProductRes;
import com.example.managementapi.Dto.Response.Product.GetProductSelectionRes;
import com.example.managementapi.Dto.Response.Product.GetProductsRes;
import com.example.managementapi.Dto.Response.Product.ProductNewArrivalRes;
import com.example.managementapi.Dto.Response.Product.ProductRes;
import com.example.managementapi.Dto.Response.Product.UpdateProductQuantityRes;
import com.example.managementapi.Dto.Response.Product.UpdateProductRes;
import com.example.managementapi.Entity.Category;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.Supplier;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:48+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductNewArrivalRes toGetProductNewArrivalRes(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductNewArrivalRes.ProductNewArrivalResBuilder productNewArrivalRes = ProductNewArrivalRes.builder();

        productNewArrivalRes.createAt( product.getCreateAt() );
        productNewArrivalRes.discount( product.getDiscount() );
        productNewArrivalRes.productCode( product.getProductCode() );
        productNewArrivalRes.productDescription( product.getProductDescription() );
        productNewArrivalRes.productId( product.getProductId() );
        List<String> list = product.getProductImage();
        if ( list != null ) {
            productNewArrivalRes.productImage( new ArrayList<String>( list ) );
        }
        productNewArrivalRes.productName( product.getProductName() );
        productNewArrivalRes.productPrice( product.getProductPrice() );
        productNewArrivalRes.productQuantity( product.getProductQuantity() );
        productNewArrivalRes.productUnit( product.getProductUnit() );
        productNewArrivalRes.productVolume( product.getProductVolume() );

        return productNewArrivalRes.build();
    }

    @Override
    public Product toProduct(CreateProductReq request) {
        if ( request == null ) {
            return null;
        }

        Product.ProductBuilder product = Product.builder();

        product.discount( request.getDiscount() );
        product.productCode( request.getProductCode() );
        product.productDescription( request.getProductDescription() );
        product.productName( request.getProductName() );
        product.productPrice( request.getProductPrice() );
        product.productQuantity( request.getProductQuantity() );
        product.productUnit( request.getProductUnit() );
        product.productVolume( request.getProductVolume() );

        return product.build();
    }

    @Override
    public ProductRes toProductResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductRes.ProductResBuilder productRes = ProductRes.builder();

        productRes.colorCode( productColorColorCode( product ) );
        productRes.createAt( product.getCreateAt() );
        productRes.discount( product.getDiscount() );
        productRes.productCode( product.getProductCode() );
        productRes.productDescription( product.getProductDescription() );
        productRes.productId( product.getProductId() );
        List<String> list = product.getProductImage();
        if ( list != null ) {
            productRes.productImage( new ArrayList<String>( list ) );
        }
        productRes.productName( product.getProductName() );
        productRes.productPrice( product.getProductPrice() );
        productRes.productQuantity( product.getProductQuantity() );
        productRes.productUnit( product.getProductUnit() );
        productRes.productVolume( product.getProductVolume() );
        productRes.updateAt( product.getUpdateAt() );

        return productRes.build();
    }

    @Override
    public GetProductsRes toGetProductsResponses(Product products) {
        if ( products == null ) {
            return null;
        }

        GetProductsRes.GetProductsResBuilder getProductsRes = GetProductsRes.builder();

        getProductsRes.supplierName( productsSupplierSupplierName( products ) );
        getProductsRes.colorName( productsColorColorName( products ) );
        getProductsRes.categoryName( productsCategoryCategoryName( products ) );
        if ( products.getCreateAt() != null ) {
            getProductsRes.createAt( DateTimeFormatter.ISO_LOCAL_DATE_TIME.format( products.getCreateAt() ) );
        }
        getProductsRes.productCode( products.getProductCode() );
        getProductsRes.productId( products.getProductId() );
        List<String> list = products.getProductImage();
        if ( list != null ) {
            getProductsRes.productImage( new ArrayList<String>( list ) );
        }
        getProductsRes.productName( products.getProductName() );
        getProductsRes.productPrice( products.getProductPrice() );
        getProductsRes.productQuantity( products.getProductQuantity() );
        getProductsRes.productUnit( products.getProductUnit() );
        getProductsRes.productVolume( products.getProductVolume() );
        if ( products.getUpdateAt() != null ) {
            getProductsRes.updateAt( DateTimeFormatter.ISO_LOCAL_DATE_TIME.format( products.getUpdateAt() ) );
        }

        return getProductsRes.build();
    }

    @Override
    public CreateProductRes toCreateProductResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        CreateProductRes.CreateProductResBuilder createProductRes = CreateProductRes.builder();

        createProductRes.createAt( product.getCreateAt() );
        createProductRes.discount( product.getDiscount() );
        createProductRes.productCode( product.getProductCode() );
        createProductRes.productDescription( product.getProductDescription() );
        createProductRes.productId( product.getProductId() );
        List<String> list = product.getProductImage();
        if ( list != null ) {
            createProductRes.productImage( new ArrayList<String>( list ) );
        }
        createProductRes.productName( product.getProductName() );
        createProductRes.productPrice( product.getProductPrice() );
        createProductRes.productQuantity( product.getProductQuantity() );
        createProductRes.productUnit( product.getProductUnit() );
        createProductRes.productVolume( product.getProductVolume() );

        return createProductRes.build();
    }

    @Override
    public void updateProduct(Product product, UpdateProductReq request) {
        if ( request == null ) {
            return;
        }

        product.setDiscount( request.getDiscount() );
        if ( request.getProductCode() != null ) {
            product.setProductCode( request.getProductCode() );
        }
        if ( request.getProductDescription() != null ) {
            product.setProductDescription( request.getProductDescription() );
        }
        if ( request.getProductName() != null ) {
            product.setProductName( request.getProductName() );
        }
        if ( request.getProductPrice() != null ) {
            product.setProductPrice( request.getProductPrice() );
        }
        product.setProductQuantity( request.getProductQuantity() );
        if ( request.getProductUnit() != null ) {
            product.setProductUnit( request.getProductUnit() );
        }
        if ( request.getProductVolume() != null ) {
            product.setProductVolume( request.getProductVolume() );
        }
    }

    @Override
    public UpdateProductRes toUpdateProductRes(Product product) {
        if ( product == null ) {
            return null;
        }

        UpdateProductRes.UpdateProductResBuilder updateProductRes = UpdateProductRes.builder();

        updateProductRes.createAt( product.getCreateAt() );
        updateProductRes.discount( product.getDiscount() );
        updateProductRes.productCode( product.getProductCode() );
        updateProductRes.productDescription( product.getProductDescription() );
        updateProductRes.productId( product.getProductId() );
        List<String> list = product.getProductImage();
        if ( list != null ) {
            updateProductRes.productImage( new ArrayList<String>( list ) );
        }
        updateProductRes.productName( product.getProductName() );
        updateProductRes.productPrice( product.getProductPrice() );
        updateProductRes.productQuantity( product.getProductQuantity() );
        updateProductRes.productUnit( product.getProductUnit() );
        updateProductRes.productVolume( product.getProductVolume() );
        updateProductRes.updateAt( product.getUpdateAt() );

        return updateProductRes.build();
    }

    @Override
    public GetProductSelectionRes toGetProductSelection(Product product) {
        if ( product == null ) {
            return null;
        }

        GetProductSelectionRes.GetProductSelectionResBuilder getProductSelectionRes = GetProductSelectionRes.builder();

        getProductSelectionRes.supplierName( productsSupplierSupplierName( product ) );
        getProductSelectionRes.productId( product.getProductId() );
        getProductSelectionRes.productName( product.getProductName() );
        getProductSelectionRes.productPrice( product.getProductPrice() );
        getProductSelectionRes.productQuantity( product.getProductQuantity() );

        return getProductSelectionRes.build();
    }

    @Override
    public void updateProductQuantity(Product product, UpdateProductQuantityReq request) {
        if ( request == null ) {
            return;
        }

        product.setProductQuantity( request.getProductQuantity() );
    }

    @Override
    public UpdateProductQuantityRes toUpdateProductQuantityRes(Product product) {
        if ( product == null ) {
            return null;
        }

        UpdateProductQuantityRes.UpdateProductQuantityResBuilder updateProductQuantityRes = UpdateProductQuantityRes.builder();

        updateProductQuantityRes.supplierName( productsSupplierSupplierName( product ) );
        updateProductQuantityRes.colorName( productsColorColorName( product ) );
        updateProductQuantityRes.categoryName( productsCategoryCategoryName( product ) );
        updateProductQuantityRes.createAt( product.getCreateAt() );
        updateProductQuantityRes.discount( product.getDiscount() );
        updateProductQuantityRes.productCode( product.getProductCode() );
        updateProductQuantityRes.productDescription( product.getProductDescription() );
        updateProductQuantityRes.productId( product.getProductId() );
        List<String> list = product.getProductImage();
        if ( list != null ) {
            updateProductQuantityRes.productImage( new ArrayList<String>( list ) );
        }
        updateProductQuantityRes.productName( product.getProductName() );
        updateProductQuantityRes.productPrice( product.getProductPrice() );
        updateProductQuantityRes.productQuantity( product.getProductQuantity() );
        updateProductQuantityRes.productUnit( product.getProductUnit() );
        updateProductQuantityRes.productVolume( product.getProductVolume() );
        updateProductQuantityRes.updateAt( product.getUpdateAt() );

        return updateProductQuantityRes.build();
    }

    private String productColorColorCode(Product product) {
        if ( product == null ) {
            return null;
        }
        Color color = product.getColor();
        if ( color == null ) {
            return null;
        }
        String colorCode = color.getColorCode();
        if ( colorCode == null ) {
            return null;
        }
        return colorCode;
    }

    private String productsSupplierSupplierName(Product product) {
        if ( product == null ) {
            return null;
        }
        Supplier supplier = product.getSupplier();
        if ( supplier == null ) {
            return null;
        }
        String supplierName = supplier.getSupplierName();
        if ( supplierName == null ) {
            return null;
        }
        return supplierName;
    }

    private String productsColorColorName(Product product) {
        if ( product == null ) {
            return null;
        }
        Color color = product.getColor();
        if ( color == null ) {
            return null;
        }
        String colorName = color.getColorName();
        if ( colorName == null ) {
            return null;
        }
        return colorName;
    }

    private String productsCategoryCategoryName(Product product) {
        if ( product == null ) {
            return null;
        }
        Category category = product.getCategory();
        if ( category == null ) {
            return null;
        }
        String categoryName = category.getCategoryName();
        if ( categoryName == null ) {
            return null;
        }
        return categoryName;
    }
}
