package com.example.mapper;

import com.example.common.dto.supplier.request.CreateSupplierReq;
import com.example.common.dto.supplier.request.UpdateSupplierReq;
import com.example.common.dto.supplier.response.*;
import com.example.persistence.entity.Supplier;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SupplierMapper {


    //* =========================== GET MAPPER ===========================

    GetSupplierSelectionRes toGetSuppliersSelection(Supplier supplier);

    GetSupplierRes toGetSuppliers(Supplier supplier);

    GetSupplierDetailRes toGetSupplierDetailRes(Supplier supplier);

    //* =========================== CREATE MAPPER ===========================

    @Mapping(target = "colors", ignore = true)
    @Mapping(target = "supplierImg", ignore = true)
    Supplier toCreateSupplierReq(CreateSupplierReq request);

    CreateSupplierRes toCreateSupplierRes(Supplier supplier);
//
    //* =========================== UPDATE MAPPER ===========================

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "supplierImg", ignore = true)
    @Mapping(target = "colors", ignore = true)
    void toUpdateSupplierReq(@MappingTarget Supplier supplier, UpdateSupplierReq request);

    UpdateSupplierRes toUpdateSupplierRes(Supplier supplier);
}
