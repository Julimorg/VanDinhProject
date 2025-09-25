package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Color.CreateColorReq;
import com.example.managementapi.Dto.Request.Color.UpdateColorReq;
import com.example.managementapi.Dto.Response.Color.CreateColorRes;
import com.example.managementapi.Dto.Response.Color.GetColorDetailRes;
import com.example.managementapi.Dto.Response.Color.GetColorRes;
import com.example.managementapi.Dto.Response.Color.UpdateColorRes;
import com.example.managementapi.Entity.Color;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ColorMapper {

    @Mapping(target = "colorImg", ignore = true)
    Color toCreateColorReq(CreateColorReq request);

    CreateColorRes toCreateColorRes(Color color);

    @Mapping(target = "colorImg", ignore = true)
    void toUpdateColor(@MappingTarget Color color, UpdateColorReq request);

    UpdateColorRes toUpdateColorRes(Color color);

    GetColorRes toGetColorRes(Color color);

    GetColorDetailRes toGetColorDetailRes(Color color);


    @Mapping(source = "colorId", target = "colorId")
    @Mapping(source = "colorName", target = "colorName")
    @Mapping(source = "colorCode", target = "colorCode")
    GetColorRes toSearchColor(Color color);



}
