package com.example.common.interfaces.supplier;

import com.example.common.dto.supplier.request.CreateSupplierReq;
import com.example.common.dto.supplier.request.UpdateSupplierReq;
import com.example.common.dto.supplier.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SupplierServiceInterface {

    List<GetSupplierSelectionRes> getSupplierSelection(String keyword);

    Page<GetSupplierRes> getSuppliers(String keyword, Pageable pageable);

    GetSupplierDetailRes getSupplierDetailRes(String supplierId);

    CreateSupplierRes createSupplier(CreateSupplierReq request);

    UpdateSupplierRes updateSupplier(String supplierId, UpdateSupplierReq request);

    void deleteSupplier(String supplier_id);
}

