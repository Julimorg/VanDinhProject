package com.example.service;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.dto.search.SupplierIndexData;
import com.example.common.interfaces.supplier.SupplierQueryInternalService;
import com.example.mapper.SupplierMapper;
import com.example.persistence.entity.Supplier;
import com.example.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class SupplierInternalServiceImpl implements SupplierQueryInternalService {

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

    @Override
    @Transactional(readOnly = true)
    public List<SupplierIndexData> fetchSuppliersForIndex() {
        return supplierRepository.findAll()
                .stream()
                .map(s -> SupplierIndexData.builder()
                        .id(s.getSupplierId())
                        .name(s.getSupplierName())
                        .image(s.getSupplierImg())
                        .build())
                .toList();
    }
}
