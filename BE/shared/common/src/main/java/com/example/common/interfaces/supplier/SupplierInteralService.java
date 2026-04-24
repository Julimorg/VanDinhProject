package com.example.common.interfaces.supplier;

import com.example.common.dto.color.CreateColorRes;
import com.example.common.dto.color.SupplierInternalDto;
import com.example.persistence.entity.Supplier;

public interface SupplierInteralService {
    void validateSupplierExists(String supplierId);

    Supplier getSupplierById(String supplierID);
}
