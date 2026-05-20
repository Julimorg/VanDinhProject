package com.example.mapper;

import com.example.common.dto.product.response.ToolDetailDto;
import com.example.persistence.entity.ToolDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ToolDetailMapper {

    @Mapping(target = "toolType", expression = "java(toolDetail.getToolType().name())")
    ToolDetailDto toDto(ToolDetail toolDetail);

}
