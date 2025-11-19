package com.example.managementapi.Service;


import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Supplier.CreateSupplierReq;
import com.example.managementapi.Dto.Request.Supplier.UpdateSupplierReq;
import com.example.managementapi.Dto.Response.Cloudinary.CloudinaryRes;
import com.example.managementapi.Dto.Response.Supplier.*;
import com.example.managementapi.Entity.Color;
import com.example.managementapi.Entity.Supplier;
import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Exception.AppException;
import com.example.managementapi.Mapper.SupplierMapper;
import com.example.managementapi.Repository.ColorRepository;
import com.example.managementapi.Repository.SupplierRepository;
import com.example.managementapi.Specification.SupplierSpecification;
import com.example.managementapi.Util.FileUpLoadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupplierService {

    private final SupplierRepository supplierRepository;

    private final SupplierMapper supplierMapper;

    private final CloudinaryService cloudinaryService;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF', 'ROLE_USER')")
    public List<GetSupplierSelectionRes> getSupplierSelection(){
        return supplierRepository.findAll()
                .stream()
                .map(supplier -> supplierMapper.toGetSuppliersSelection(supplier))
                .toList();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER','ROLE_STAFF')")
    public Page<GetSupplierRes> getSuppliers(String keyword, Pageable pageable){
        Specification<Supplier> spec = SupplierSpecification.searchByCriteria(keyword);
        return supplierRepository.findAll(spec,pageable)
                .map(supplier -> supplierMapper.toGetSuppliers(supplier));
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_USER','ROLE_STAFF')")
    public GetSupplierDetailRes getSupplierDetailRes(String supplierId){

        return supplierMapper.toGetSupplierDetailRes(supplierRepository
                .findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found")));
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public CreateSupplierRes createSupplier(CreateSupplierReq request){

        MultipartFile image = request.getSupplierImg();
        String imgUrl = null;

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = image.getOriginalFilename();
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            imgUrl = cloudinaryRes.getUrl();
        }

       var supplier = supplierMapper.toCreateSupplierReq(request);

        supplier.setSupplierImg(imgUrl);

       supplier = supplierRepository.save(supplier);

        return supplierMapper.toCreateSupplierRes(supplier);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public UpdateSupplierRes updateSupplier(String supplierId, UpdateSupplierReq request){

        Supplier supplier = supplierRepository.findById(supplierId).orElseThrow(()
                -> new RuntimeException("Supplier not found"));

        MultipartFile image = request.getSupplierImg();

        if(image != null && !image.isEmpty()){
            FileUpLoadUtil.assertAllowed(image, FileUpLoadUtil.IMAGE_PATTERN);
            String fileName = image.getOriginalFilename();
            CloudinaryRes cloudinaryRes = cloudinaryService.uploadFile(image, fileName);
            supplier.setSupplierImg(cloudinaryRes.getUrl());
        }

        supplierMapper.toUpdateSupplierReq(supplier, request);


        return supplierMapper.toUpdateSupplierRes(supplierRepository.save(supplier));

    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public void deleteSupplier(String supplier_id){

        if(!supplierRepository.existsById(supplier_id)){
            throw new RuntimeException("Supplier not found");
        }

        supplierRepository.deleteById(supplier_id);
    }


}
