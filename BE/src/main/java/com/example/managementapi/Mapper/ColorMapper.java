package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Color.CreateColorReq;
import com.example.managementapi.Dto.Request.Color.UpdateColorReq;
import com.example.managementapi.Dto.Response.Color.*;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ColorMapper {

    //* =========================== GET MAPPER ===========================
    GetColorRes toGetColorRes(Color color);

    GetColorWithSupplierRes toGetColorWithSupplier(Color color);

    SupplierInColorDetailRes toSupplierInColorDetailRes(Supplier supplier);

    @Mapping(source = "colorId", target = "colorId")
    @Mapping(source = "colorName", target = "colorName")
    GetColorDetailRes toGetColorDetailRes(Color color);


    @Mapping(source = "colorId", target = "colorId")
    @Mapping(source = "colorName", target = "colorName")
    @Mapping(source = "colorCode", target = "colorCode")
    GetColorRes toSearchColor(Color color);

    //* =========================== CREATE MAPPER ===========================

    CreateColorRes toCreateColorRes(Color color);

    @Mapping(target = "colorImg", ignore = true)
    Color toCreateColorReq(CreateColorReq request);

    //* =========================== UPDATE MAPPER ===========================

    @Mapping(target = "colorImg", ignore = true)
    void toUpdateColor(@MappingTarget Color color, UpdateColorReq request);

    UpdateColorRes toUpdateColorRes(Color color);

}
