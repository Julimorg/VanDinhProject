package com.example.controller;

import com.example.common.dto.inventory.request.CreateItemInPurchaseOrderReq;
import com.example.common.dto.inventory.request.CreatePurchaseOrderReq;
import com.example.common.dto.inventory.request.UpdatePurchaseOrderReq;
import com.example.common.dto.inventory.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.config.InventorySpecification;
import com.example.service.ExportPurchaseOrderPdfFile;
import com.example.service.InventoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Null;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("api/v1/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    private final ExportPurchaseOrderPdfFile exportPurchaseOrderPdfFile;

    @GetMapping("/{purchaseOrderId}/export-pdf")
    public ResponseEntity<byte[]> exportPurchaseOrderPDF(@PathVariable String purchaseOrderId) {
        GetPurchaseOrderDetailRes order = inventoryService.getPurchaseOrderDetail(purchaseOrderId);
        byte[] pdf = exportPurchaseOrderPdfFile.export(order);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"phieu-nhap-kho-" + order.getPoCode() + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/{purchaseOrderId}")
    public ApiResponse<GetPurchaseOrderDetailRes> getPurchaseOrderDetail(@PathVariable String purchaseOrderId){
        return ApiResponse.<GetPurchaseOrderDetailRes>builder()
                .status_code(SuccessCode.CREATE_INVENTORY.getStatusCode().value())
                .message(SuccessCode.CREATE_INVENTORY.getMessage())
                .data(inventoryService.getPurchaseOrderDetail(purchaseOrderId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/get-history")
    public ApiResponse<Page<GetPurchaseOrderRes>> getPurchaseOrder(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String orderDateFrom,
            @RequestParam(required = false) String orderDateTo,
            @PageableDefault(size = 10, sort = "createAt", direction = Sort.Direction.DESC)
            Pageable pageable) {

        return ApiResponse.<Page<GetPurchaseOrderRes>>builder()
                .status_code(SuccessCode.GET_INVENTORY.getStatusCode().value())
                .message(SuccessCode.GET_INVENTORY.getMessage())
                .data(inventoryService.getPurchaseOrder(
                        keyword,status, orderDateFrom, orderDateTo, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/create-purchase")
    public ApiResponse<CreatePurchaseOrderRes> createPurchaseOrder(@RequestBody CreatePurchaseOrderReq req){
        return ApiResponse.<CreatePurchaseOrderRes>builder()
                .status_code(SuccessCode.CREATE_INVENTORY.getStatusCode().value())
                .message(SuccessCode.CREATE_INVENTORY.getMessage())
                .data(inventoryService.createPurchaseOrder(req))
                .timestamp(LocalDateTime.now())
                .build();

    }

    @PostMapping("/{purchaseOrderId}/add-items")
    public ApiResponse<CreateItemInPurchaseOrderRes> createItemInPurchaseOrder(
            @PathVariable String purchaseOrderId,
            @RequestBody @Valid List<CreateItemInPurchaseOrderReq> req){
        return ApiResponse.<CreateItemInPurchaseOrderRes>builder()
                .status_code(SuccessCode.CREATE_INVENTORY.getStatusCode().value())
                .message(SuccessCode.CREATE_INVENTORY.getMessage())
                .data(inventoryService.createItemInPurchaseOrder(purchaseOrderId, req))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/update-purchase/{purchaseOrderId}")
    public ApiResponse<UpdatePurchaseOrderRes> updatePurchaseOrder(
            @PathVariable String purchaseOrderId,
            @RequestBody UpdatePurchaseOrderReq req){

        return ApiResponse.<UpdatePurchaseOrderRes>builder()
                .status_code(SuccessCode.UPDATE_INVENTORY.getStatusCode().value())
                .message(SuccessCode.UPDATE_INVENTORY.getMessage())
                .data(inventoryService.updatePurchaseOrder(purchaseOrderId, req))
                .timestamp(LocalDateTime.now())
                .build();

    }


    @DeleteMapping("/delete-purchase/{purchaseOrderId}")
    public ApiResponse<Void> deletePurchaseOrder(@PathVariable String purchaseOrderId){
        inventoryService.deletePurchaseById(purchaseOrderId);
        return ApiResponse.<Void>builder()
                .status_code(SuccessCode.DELETE_PURCHASE_ORDER.getStatusCode().value())
                .message(SuccessCode.DELETE_PURCHASE_ORDER.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @DeleteMapping("/delete-item/{itemId}")
    public ApiResponse<Void> deletePurchaseItemOrder(@PathVariable String itemId){
        inventoryService.deletePurchaseItemOrderById(itemId);
        return ApiResponse.<Void>builder()
                .status_code(SuccessCode.DELETE_PURCHASE_ORDER.getStatusCode().value())
                .message(SuccessCode.DELETE_PURCHASE_ORDER.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }


}
