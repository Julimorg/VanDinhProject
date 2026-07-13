package com.example.common.interfaces.supplier;
import com.example.persistence.entity.Supplier;
import com.example.common.dto.search.SupplierIndexData;
import java.util.Optional;
import java.util.List;

public interface SupplierQueryInternalService {

    void validateSupplierExists(String supplierId);

    Supplier getSupplierById(String supplierID);

    List<SupplierIndexData> fetchSuppliersForIndex();
}
