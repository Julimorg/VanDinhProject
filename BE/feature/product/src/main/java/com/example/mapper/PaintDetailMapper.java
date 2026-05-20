package com.example.mapper;

import com.example.common.dto.product.response.PaintDetailDto;
import com.example.persistence.entity.PaintDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaintDetailMapper {

    @Mapping(target = "colorId",   source = "color.colorId")
    @Mapping(target = "colorName", source = "color.colorName")
    @Mapping(target = "colorCode", source = "color.colorCode")
    @Mapping(target = "hexCode",   source = "color.hexCode")
    PaintDetailDto toDto(PaintDetail paintDetail);

}
