package com.example.mapper;

import com.example.common.dto.product.request.UpdateProductReq;
import com.example.common.dto.product.response.ChemicalDetailDto;
import com.example.persistence.entity.ChemicalDetail;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ChemicalDetailMapper {

    ChemicalDetailDto toDto(ChemicalDetail chemicalDetail);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "product",   ignore = true)
    @Mapping(target = "extraSpecs", ignore = true)
    void updateChemicalDetailEntity(@MappingTarget ChemicalDetail chemicalDetail,
                                    UpdateProductReq request);

}
