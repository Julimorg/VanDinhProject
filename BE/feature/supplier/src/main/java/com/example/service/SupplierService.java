package com.example.service;

import com.example.common.dto.color.response.GetAlbumWithColorRes;
import com.example.common.dto.color.response.GetColorSummaryRes;
import com.example.common.dto.supplier.request.CreateSupplierReq;
import com.example.common.dto.supplier.request.UpdateSupplierReq;
import com.example.common.dto.supplier.response.*;
import com.example.common.enums.ErrorCode;
import com.example.common.interfaces.color.ColorQueryInternalService;
import com.example.common.interfaces.supplier.SupplierServiceInterface;
import com.example.common.service.FileUploadService;
import com.example.config.SupplierSpecification;
import com.example.mapper.SupplierMapper;
import com.example.persistence.entity.Album;
import com.example.persistence.entity.Color;
import com.example.persistence.entity.Supplier;
import com.example.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.context.ApplicationEventPublisher;
import com.example.common.events.search.SearchIndexEvent;
import com.example.common.events.search.SearchDeleteEvent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupplierService implements SupplierServiceInterface {

    private final SupplierRepository supplierRepository;

    private final ColorQueryInternalService colorQueryInternalService;

    private final SupplierMapper supplierMapper;

    private final FileUploadService fileUploadService;

    private final ApplicationEventPublisher publisher;

    /* TODO ELASTIC-SEARCH
    * Nhớ config elastic search cho supplier
    * */

    @Override
    public List<GetSupplierSelectionRes> getSupplierSelection(String keyword){
        Specification<Supplier> spec = SupplierSpecification
                .supported((SupplierSpecification.SupplierFilter.keywordOnly(keyword)));

        return supplierRepository.findAll(spec)
                .stream()
                .map(supplier -> supplierMapper.toGetSuppliersSelection(supplier))
                .toList();
    }

    @Override
    public Page<GetSupplierRes> getSuppliers(String keyword, Pageable pageable){

        Specification<Supplier> spec = SupplierSpecification
                .from(SupplierSpecification
                        .SupplierFilter
                        .keywordOnly(keyword));

        return supplierRepository.findAll(spec,pageable)
                .map(supplier -> supplierMapper.toGetSuppliers(supplier));
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public GetSupplierDetailRes getSupplierDetailRes(String supplierId){

        return supplierMapper.toGetSupplierDetailRes(supplierRepository
                .findById(supplierId)
                .orElseThrow(() -> new RuntimeException(ErrorCode.SUPPLIER_NOT_FOUND.getMessage())));
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateSupplierRes createSupplier(CreateSupplierReq request){


        var supplier = supplierMapper.toCreateSupplierReq(request);

        supplier.setSupplierImg(fileUploadService
                .uploadImageIfPresent(
                        request.getSupplierImg(),
                        supplier.getSupplierName())
        );

        supplier = supplierRepository.save(supplier);

//        elasticSearchService.saveSupplier(supplier);
        publisher.publishEvent(SearchIndexEvent.builder()
                .id("S_" + supplier.getSupplierId())
                .type("SUPPLIER")
                .entityId(supplier.getSupplierId())
                .name(supplier.getSupplierName())
                .image(supplier.getSupplierImg())
                .build());

        return supplierMapper.toCreateSupplierRes(supplier);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateSupplierRes updateSupplier(String supplierId, UpdateSupplierReq request){

        Supplier supplier = supplierRepository.findById(supplierId).orElseThrow(()
                -> new RuntimeException("Supplier not found"));

        supplierMapper.toUpdateSupplierReq(supplier, request);

        supplier.setSupplierImg(fileUploadService
                .uploadImageIfPresent(
                        request.getSupplierImg(),
                        supplier.getSupplierName())
        );

        supplier = supplierRepository.save(supplier);
//        elasticSearchService.saveSupplier(supplier);
        publisher.publishEvent(SearchIndexEvent.builder()
                .id("S_" + supplier.getSupplierId())
                .type("SUPPLIER")
                .entityId(supplier.getSupplierId())
                .name(supplier.getSupplierName())
                .image(supplier.getSupplierImg())
                .build());

        return supplierMapper.toUpdateSupplierRes(supplier);

    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteSupplier(String supplier_id){

        if(!supplierRepository.existsById(supplier_id)){
            throw new RuntimeException("Supplier not found");
        }

        supplierRepository.deleteById(supplier_id);
        publisher.publishEvent(new SearchDeleteEvent("S_" + supplier_id));
//        elasticSearchService.delete("S_" + supplier_id);
    }

}
