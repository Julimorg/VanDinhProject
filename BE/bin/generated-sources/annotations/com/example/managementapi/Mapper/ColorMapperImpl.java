package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Color.CreateColorReq;
import com.example.managementapi.Dto.Request.Color.UpdateColorReq;
import com.example.managementapi.Dto.Response.Color.CreateColorRes;
import com.example.managementapi.Dto.Response.Color.GetColorDetailRes;
import com.example.managementapi.Dto.Response.Color.GetColorRes;
import com.example.managementapi.Dto.Response.Color.GetColorWithSupplierRes;
import com.example.managementapi.Dto.Response.Color.SupplierInColorDetailRes;
import com.example.managementapi.Dto.Response.Color.UpdateColorRes;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Supplier;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:49+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ColorMapperImpl implements ColorMapper {

    @Override
    public GetColorRes toGetColorRes(Color color) {
        if ( color == null ) {
            return null;
        }

        GetColorRes.GetColorResBuilder getColorRes = GetColorRes.builder();

        getColorRes.colorCode( color.getColorCode() );
        getColorRes.colorDescription( color.getColorDescription() );
        getColorRes.colorId( color.getColorId() );
        getColorRes.colorImg( color.getColorImg() );
        getColorRes.colorName( color.getColorName() );
        getColorRes.createAt( color.getCreateAt() );
        getColorRes.updateAt( color.getUpdateAt() );

        return getColorRes.build();
    }

    @Override
    public GetColorWithSupplierRes toGetColorWithSupplier(Color color) {
        if ( color == null ) {
            return null;
        }

        GetColorWithSupplierRes.GetColorWithSupplierResBuilder getColorWithSupplierRes = GetColorWithSupplierRes.builder();

        getColorWithSupplierRes.colorCode( color.getColorCode() );
        getColorWithSupplierRes.colorId( color.getColorId() );
        getColorWithSupplierRes.colorName( color.getColorName() );

        return getColorWithSupplierRes.build();
    }

    @Override
    public SupplierInColorDetailRes toSupplierInColorDetailRes(Supplier supplier) {
        if ( supplier == null ) {
            return null;
        }

        SupplierInColorDetailRes.SupplierInColorDetailResBuilder supplierInColorDetailRes = SupplierInColorDetailRes.builder();

        supplierInColorDetailRes.supplierId( supplier.getSupplierId() );
        supplierInColorDetailRes.supplierName( supplier.getSupplierName() );

        return supplierInColorDetailRes.build();
    }

    @Override
    public GetColorDetailRes toGetColorDetailRes(Color color) {
        if ( color == null ) {
            return null;
        }

        GetColorDetailRes.GetColorDetailResBuilder getColorDetailRes = GetColorDetailRes.builder();

        getColorDetailRes.colorId( color.getColorId() );
        getColorDetailRes.colorName( color.getColorName() );
        getColorDetailRes.colorCode( color.getColorCode() );
        getColorDetailRes.colorDescription( color.getColorDescription() );
        getColorDetailRes.colorImg( color.getColorImg() );
        getColorDetailRes.createAt( color.getCreateAt() );
        getColorDetailRes.supplier( toSupplierInColorDetailRes( color.getSupplier() ) );
        getColorDetailRes.updateAt( color.getUpdateAt() );

        return getColorDetailRes.build();
    }

    @Override
    public GetColorRes toSearchColor(Color color) {
        if ( color == null ) {
            return null;
        }

        GetColorRes.GetColorResBuilder getColorRes = GetColorRes.builder();

        getColorRes.colorId( color.getColorId() );
        getColorRes.colorName( color.getColorName() );
        getColorRes.colorCode( color.getColorCode() );
        getColorRes.colorDescription( color.getColorDescription() );
        getColorRes.colorImg( color.getColorImg() );
        getColorRes.createAt( color.getCreateAt() );
        getColorRes.updateAt( color.getUpdateAt() );

        return getColorRes.build();
    }

    @Override
    public CreateColorRes toCreateColorRes(Color color) {
        if ( color == null ) {
            return null;
        }

        CreateColorRes.CreateColorResBuilder createColorRes = CreateColorRes.builder();

        createColorRes.colorCode( color.getColorCode() );
        createColorRes.colorDescription( color.getColorDescription() );
        createColorRes.colorId( color.getColorId() );
        createColorRes.colorImg( color.getColorImg() );
        createColorRes.colorName( color.getColorName() );
        createColorRes.createAt( color.getCreateAt() );
        createColorRes.supplier( toSupplierInColorDetailRes( color.getSupplier() ) );

        return createColorRes.build();
    }

    @Override
    public Color toCreateColorReq(CreateColorReq request) {
        if ( request == null ) {
            return null;
        }

        Color.ColorBuilder color = Color.builder();

        color.colorCode( request.getColorCode() );
        color.colorDescription( request.getColorDescription() );
        color.colorName( request.getColorName() );

        return color.build();
    }

    @Override
    public void toUpdateColor(Color color, UpdateColorReq request) {
        if ( request == null ) {
            return;
        }

        color.setColorCode( request.getColorCode() );
        color.setColorDescription( request.getColorDescription() );
        color.setColorName( request.getColorName() );
    }

    @Override
    public UpdateColorRes toUpdateColorRes(Color color) {
        if ( color == null ) {
            return null;
        }

        UpdateColorRes.UpdateColorResBuilder updateColorRes = UpdateColorRes.builder();

        updateColorRes.colorCode( color.getColorCode() );
        updateColorRes.colorDescription( color.getColorDescription() );
        updateColorRes.colorId( color.getColorId() );
        updateColorRes.colorImg( color.getColorImg() );
        updateColorRes.colorName( color.getColorName() );
        updateColorRes.supplier( toSupplierInColorDetailRes( color.getSupplier() ) );
        updateColorRes.updateAt( color.getUpdateAt() );

        return updateColorRes.build();
    }
}
