package com.example.mapper;

import com.example.common.dto.color.*;
import com.example.common.dto.color.request.CreateColorReq;
import com.example.common.dto.color.request.UpdateColorReq;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ColorMapper {
    //* =========================== GET MAPPER ===========================
    GetColorRes toGetColorRes(Color color);

    GetColorWithSupplierRes toGetColorWithSupplier(Color color);

    SupplierInColorDetailRes toSupplierInColorDetailRes(Supplier supplier);

    Color toGetColorByIdWithInterface(Color color);

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
