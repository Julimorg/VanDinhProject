package com.example.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.supplier.SupplierInteralService;
import com.example.mapper.SupplierMapper;
import com.example.persistence.entity.Supplier;
import com.example.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class SupplierInternalServiceImpl implements SupplierInteralService {

    private final SupplierRepository supplierRepository;

    private final SupplierMapper supplierMapper;

    @Override
    public void validateSupplierExists(String supplierId) {
        if (!supplierRepository.existsById(supplierId)) {
            throw new AppException(ErrorCode.SUPPLIER_NOT_EXISTED);
        }
    }

    @Override
    public Supplier getSupplierById(String supplierId) {

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));

        return supplierMapper.toConfigSupplierInternalDto(supplier);
    }
}
