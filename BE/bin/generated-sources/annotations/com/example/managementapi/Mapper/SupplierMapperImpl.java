package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Supplier.CreateSupplierReq;
import com.example.managementapi.Dto.Request.Supplier.UpdateSupplierReq;
import com.example.managementapi.Dto.Response.Supplier.ColorInSupplierDetailRes;
import com.example.managementapi.Dto.Response.Supplier.CreateSupplierRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierDetailRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierSelectionRes;
import com.example.managementapi.Dto.Response.Supplier.ProductInSupplierDetailRes;
import com.example.managementapi.Dto.Response.Supplier.UpdateSupplierRes;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Entity.Supplier;
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
public class SupplierMapperImpl implements SupplierMapper {

    @Override
    public GetSupplierRes toGetSuppliers(Supplier supplier) {
        if ( supplier == null ) {
            return null;
        }

        GetSupplierRes.GetSupplierResBuilder getSupplierRes = GetSupplierRes.builder();

        getSupplierRes.createAt( supplier.getCreateAt() );
        getSupplierRes.supplierAddress( supplier.getSupplierAddress() );
        getSupplierRes.supplierEmail( supplier.getSupplierEmail() );
        getSupplierRes.supplierId( supplier.getSupplierId() );
        getSupplierRes.supplierImg( supplier.getSupplierImg() );
        getSupplierRes.supplierName( supplier.getSupplierName() );
        getSupplierRes.supplierPhone( supplier.getSupplierPhone() );
        getSupplierRes.updateAt( supplier.getUpdateAt() );

        return getSupplierRes.build();
    }

    @Override
    public GetSupplierSelectionRes toGetSuppliersSelection(Supplier supplier) {
        if ( supplier == null ) {
            return null;
        }

        GetSupplierSelectionRes.GetSupplierSelectionResBuilder getSupplierSelectionRes = GetSupplierSelectionRes.builder();

        getSupplierSelectionRes.supplierId( supplier.getSupplierId() );
        getSupplierSelectionRes.supplierName( supplier.getSupplierName() );

        return getSupplierSelectionRes.build();
    }

    @Override
    public GetSupplierDetailRes toGetSupplierDetailRes(Supplier supplier) {
        if ( supplier == null ) {
            return null;
        }

        GetSupplierDetailRes.GetSupplierDetailResBuilder getSupplierDetailRes = GetSupplierDetailRes.builder();

        getSupplierDetailRes.colors( colorListToColorInSupplierDetailResList( supplier.getColors() ) );
        getSupplierDetailRes.createAt( supplier.getCreateAt() );
        getSupplierDetailRes.products( productListToProductInSupplierDetailResList( supplier.getProducts() ) );
        getSupplierDetailRes.supplierAddress( supplier.getSupplierAddress() );
        getSupplierDetailRes.supplierEmail( supplier.getSupplierEmail() );
        getSupplierDetailRes.supplierId( supplier.getSupplierId() );
        getSupplierDetailRes.supplierImg( supplier.getSupplierImg() );
        getSupplierDetailRes.supplierName( supplier.getSupplierName() );
        getSupplierDetailRes.supplierPhone( supplier.getSupplierPhone() );
        getSupplierDetailRes.updateAt( supplier.getUpdateAt() );

        return getSupplierDetailRes.build();
    }

    @Override
    public Supplier toCreateSupplierReq(CreateSupplierReq request) {
        if ( request == null ) {
            return null;
        }

        Supplier.SupplierBuilder supplier = Supplier.builder();

        supplier.supplierAddress( request.getSupplierAddress() );
        supplier.supplierEmail( request.getSupplierEmail() );
        supplier.supplierName( request.getSupplierName() );
        supplier.supplierPhone( request.getSupplierPhone() );

        return supplier.build();
    }

    @Override
    public CreateSupplierRes toCreateSupplierRes(Supplier supplier) {
        if ( supplier == null ) {
            return null;
        }

        CreateSupplierRes.CreateSupplierResBuilder createSupplierRes = CreateSupplierRes.builder();

        createSupplierRes.createAt( supplier.getCreateAt() );
        createSupplierRes.supplierAddress( supplier.getSupplierAddress() );
        createSupplierRes.supplierEmail( supplier.getSupplierEmail() );
        createSupplierRes.supplierId( supplier.getSupplierId() );
        createSupplierRes.supplierImg( supplier.getSupplierImg() );
        createSupplierRes.supplierName( supplier.getSupplierName() );
        createSupplierRes.supplierPhone( supplier.getSupplierPhone() );

        return createSupplierRes.build();
    }

    @Override
    public void toUpdateSupplierReq(Supplier supplier, UpdateSupplierReq request) {
        if ( request == null ) {
            return;
        }

        if ( request.getSupplierAddress() != null ) {
            supplier.setSupplierAddress( request.getSupplierAddress() );
        }
        if ( request.getSupplierEmail() != null ) {
            supplier.setSupplierEmail( request.getSupplierEmail() );
        }
        if ( request.getSupplierName() != null ) {
            supplier.setSupplierName( request.getSupplierName() );
        }
        if ( request.getSupplierPhone() != null ) {
            supplier.setSupplierPhone( request.getSupplierPhone() );
        }
    }

    @Override
    public UpdateSupplierRes toUpdateSupplierRes(Supplier supplier) {
        if ( supplier == null ) {
            return null;
        }

        UpdateSupplierRes.UpdateSupplierResBuilder updateSupplierRes = UpdateSupplierRes.builder();

        updateSupplierRes.supplierAddress( supplier.getSupplierAddress() );
        updateSupplierRes.supplierEmail( supplier.getSupplierEmail() );
        updateSupplierRes.supplierId( supplier.getSupplierId() );
        updateSupplierRes.supplierImg( supplier.getSupplierImg() );
        updateSupplierRes.supplierName( supplier.getSupplierName() );
        updateSupplierRes.supplierPhone( supplier.getSupplierPhone() );
        updateSupplierRes.updateAt( supplier.getUpdateAt() );

        return updateSupplierRes.build();
    }

    protected ColorInSupplierDetailRes colorToColorInSupplierDetailRes(Color color) {
        if ( color == null ) {
            return null;
        }

        ColorInSupplierDetailRes.ColorInSupplierDetailResBuilder colorInSupplierDetailRes = ColorInSupplierDetailRes.builder();

        colorInSupplierDetailRes.colorCode( color.getColorCode() );
        colorInSupplierDetailRes.colorDescription( color.getColorDescription() );
        colorInSupplierDetailRes.colorId( color.getColorId() );
        colorInSupplierDetailRes.colorImg( color.getColorImg() );
        colorInSupplierDetailRes.colorName( color.getColorName() );

        return colorInSupplierDetailRes.build();
    }

    protected List<ColorInSupplierDetailRes> colorListToColorInSupplierDetailResList(List<Color> list) {
        if ( list == null ) {
            return null;
        }

        List<ColorInSupplierDetailRes> list1 = new ArrayList<ColorInSupplierDetailRes>( list.size() );
        for ( Color color : list ) {
            list1.add( colorToColorInSupplierDetailRes( color ) );
        }

        return list1;
    }

    protected ProductInSupplierDetailRes productToProductInSupplierDetailRes(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductInSupplierDetailRes.ProductInSupplierDetailResBuilder productInSupplierDetailRes = ProductInSupplierDetailRes.builder();

        productInSupplierDetailRes.productId( product.getProductId() );
        productInSupplierDetailRes.productName( product.getProductName() );
        productInSupplierDetailRes.productPrice( product.getProductPrice() );
        productInSupplierDetailRes.productQuantity( product.getProductQuantity() );

        return productInSupplierDetailRes.build();
    }

    protected List<ProductInSupplierDetailRes> productListToProductInSupplierDetailResList(List<Product> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductInSupplierDetailRes> list1 = new ArrayList<ProductInSupplierDetailRes>( list.size() );
        for ( Product product : list ) {
            list1.add( productToProductInSupplierDetailRes( product ) );
        }

        return list1;
    }
}
