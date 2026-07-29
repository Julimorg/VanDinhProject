package com.example.mapper;

import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.PaintDetailDto;
import com.example.persistence.entity.PaintDetail;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PaintDetailMapper {

    @Mapping(target = "colorId",   source = "color.colorId")
    @Mapping(target = "colorName", source = "color.colorName")
    @Mapping(target = "colorCode", source = "color.colorCode")
    @Mapping(target = "hexCode",   source = "color.hexCode")
    PaintDetailDto toDto(PaintDetail paintDetail);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "product",   ignore = true)
    @Mapping(target = "color",     ignore = true)
    @Mapping(target = "extraSpecs", ignore = true)
    void updatePaintDetailEntity(@MappingTarget PaintDetail paintDetail,
                                 UpdateProductReq request);
}
