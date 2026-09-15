package com.example.controller;

import com.example.common.dto.supplier.request.CreateSupplierReq;
import com.example.common.dto.supplier.request.UpdateSupplierReq;
import com.example.common.dto.supplier.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.service.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("api/v1/supplier")
public class SupplierController {

    private final SupplierService supplierService;


    @GetMapping("/select-suppliers")
    public ApiResponse<List<GetSupplierSelectionRes>> getSupplierSelection(
            @RequestParam(required = false) String keyword
    ){
        return ApiResponse.<List<GetSupplierSelectionRes>>
                builder()
                .status_code(SuccessCode.GET_SUPPLIER_SELECTION.getStatusCode().value())
                .message(SuccessCode.GET_SUPPLIER_SELECTION.getMessage())
                .data(supplierService.getSupplierSelection(keyword))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-suppliers")
    public ApiResponse<Page<GetSupplierRes>> getSupplier(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "supplierName", direction = Sort.Direction.ASC) Pageable pageable
    ){
        return ApiResponse.<Page<GetSupplierRes>>builder()
                .status_code(SuccessCode.GET_SUPPLIER.getStatusCode().value())
                .message(SuccessCode.GET_SUPPLIER.getMessage())
                .data(supplierService.getSuppliers(keyword, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-supplier/{supplierId}")
    public ApiResponse<GetSupplierDetailRes> getSupplierDetail(@PathVariable String supplierId){
        return ApiResponse.<GetSupplierDetailRes>builder()
                .status_code(SuccessCode.GET_SUPPLIER_DETAIL.getStatusCode().value())
                .message(SuccessCode.GET_SUPPLIER_DETAIL.getMessage())
                .data(supplierService.getSupplierDetailRes(supplierId))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @PostMapping(value = "/create-supplier", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<CreateSupplierRes> createSupplier(
            //? Sử dụng @ModelAttribute để ánh xạ toàn bộ form-data vào CreateColorReq
            @ModelAttribute CreateSupplierReq request) {

        return ApiResponse.<CreateSupplierRes>builder()
                .status_code(SuccessCode.CREATE_SUPPLIER.getStatusCode().value())
                .message(SuccessCode.CREATE_SUPPLIER.getMessage())
                .data(supplierService.createSupplier(request))
                .timestamp(LocalDateTime.now())
                .build();
    }
    @PatchMapping(value = "/update-supplier/{supplierId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UpdateSupplierRes> updateSupplier(@PathVariable String supplierId,
                                                         @ModelAttribute UpdateSupplierReq request) {

//        log.warn("supplier_id: " + supplierId);
        return ApiResponse.<UpdateSupplierRes>builder()
                .status_code(SuccessCode.UPDATE_SUPPLIER.getStatusCode().value())
                .message(SuccessCode.UPDATE_SUPPLIER.getMessage())
                .data(supplierService.updateSupplier(supplierId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/delete-supplier/{supplierId}")
    public ApiResponse<String> deleteSupplier(@PathVariable String supplierId) {
        supplierService.deleteSupplier(supplierId);
        return ApiResponse.<String>builder()
                .status_code(SuccessCode.DELETE_SUPPLIER.getStatusCode().value())
                .message(SuccessCode.DELETE_SUPPLIER.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }



}
