package com.example.common.interfaces.supplier;

import com.example.common.dto.color.CreateColorRes;
import com.example.common.dto.color.SupplierInternalDto;
import com.example.persistence.entity.Supplier;
import com.example.common.dto.search.SupplierIndexData;
import java.util.Optional;
import java.util.List;

public interface SupplierInternalService {

    void validateSupplierExists(String supplierId);

    Supplier getSupplierById(String supplierID);

    List<SupplierIndexData> fetchSuppliersForIndex();
}
