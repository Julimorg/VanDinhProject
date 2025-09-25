package com.example.managementapi.Mapper;


import com.example.managementapi.Dto.Request.Supplier.CreateSupplierReq;
import com.example.managementapi.Dto.Request.Supplier.UpdateSupplierReq;
import com.example.managementapi.Dto.Response.Supplier.CreateSupplierRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierDetailRes;
import com.example.managementapi.Dto.Response.Supplier.GetSupplierRes;
import com.example.managementapi.Dto.Response.Supplier.UpdateSupplierRes;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SupplierMapper {

    @Mapping(target = "colors", ignore = true)
    @Mapping(target = "supplierImg", ignore = true)
    Supplier toCreateSupplierReq(CreateSupplierReq request);

    CreateSupplierRes toCreateSupplierRes(Supplier supplier);

    @Mapping(target = "supplierImg", ignore = true)
    @Mapping(target = "colors", ignore = true)
    void toUpdateSupplierReq(@MappingTarget Supplier supplier, UpdateSupplierReq request);

    @Mapping(target = "colorId", source = "colors")
    UpdateSupplierRes toUpdateSupplierRes(Supplier supplier);

    default List<String> mapColorsToIds(List<Color> colors) {
        if (colors == null) return null;
        return colors.stream()
                .map(color -> color.getColorId().toString())
                .toList();
    }

    GetSupplierRes toGetSuppliers(Supplier supplier);

    GetSupplierDetailRes toGetSupplierDetailRes(Supplier supplier);


}
