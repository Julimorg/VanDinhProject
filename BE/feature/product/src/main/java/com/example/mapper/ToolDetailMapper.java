package com.example.mapper;

import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.ToolDetailDto;
import com.example.persistence.entity.ToolDetail;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ToolDetailMapper {

    ToolDetailDto toDto(ToolDetail toolDetail);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "product",   ignore = true)
    void updateToolDetailEntity(@MappingTarget ToolDetail toolDetail,
                                UpdateProductReq request);


}
