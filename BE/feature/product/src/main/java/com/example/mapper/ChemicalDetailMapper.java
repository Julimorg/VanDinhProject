package com.example.mapper;

import com.example.common.dto.product.response.ChemicalDetailDto;
import com.example.persistence.entity.ChemicalDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChemicalDetailMapper {

    ChemicalDetailDto toDto(ChemicalDetail chemicalDetail);

}
