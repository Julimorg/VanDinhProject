package com.example.managementapi.Mapper;


import com.example.managementapi.Dto.Request.Supplier.CreateSupplierReq;
import com.example.managementapi.Dto.Request.Supplier.UpdateSupplierReq;
import com.example.managementapi.Dto.Response.Supplier.*;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Supplier;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SupplierMapper {


    //* =========================== GET MAPPER ===========================

    GetSupplierRes toGetSuppliers(Supplier supplier);

    GetSupplierSelectionRes toGetSuppliersSelection(Supplier supplier);

    GetSupplierDetailRes  toGetSupplierDetailRes(Supplier supplier);


    //* =========================== CREATE MAPPER ===========================

    @Mapping(target = "colors", ignore = true)
    @Mapping(target = "supplierImg", ignore = true)
    Supplier toCreateSupplierReq(CreateSupplierReq request);

    CreateSupplierRes toCreateSupplierRes(Supplier supplier);

    //* =========================== PATCH MAPPER ===========================

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "supplierImg", ignore = true)
    @Mapping(target = "colors", ignore = true)
    void toUpdateSupplierReq(@MappingTarget Supplier supplier, UpdateSupplierReq request);

    UpdateSupplierRes toUpdateSupplierRes(Supplier supplier);
}
