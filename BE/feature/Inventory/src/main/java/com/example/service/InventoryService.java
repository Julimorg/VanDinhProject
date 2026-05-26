package com.example.service;

import com.example.common.dto.inventory.request.CreateItemInPurchaseOrderReq;
import com.example.common.dto.inventory.request.CreatePurchaseOrderReq;
import com.example.common.dto.inventory.response.CreateItemInPurchaseOrderRes;
import com.example.common.dto.inventory.response.CreatePurchaseOrderRes;
import com.example.common.dto.inventory.response.GetPurchaseOrderDetailRes;
import com.example.common.dto.inventory.response.GetPurchaseOrderRes;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.user.UserInternalService;
import com.example.config.InventorySpecification;
import com.example.mapper.PurchaseOrderMapper;
import com.example.persistence.entity.PurchaseOrder;
import com.example.persistence.entity.PurchaseOrderItem;
import com.example.persistence.enumTable.PurchaseOrderStatus;
import com.example.repository.PurchaseOrderItemRepository;
import com.example.repository.PurchaseOrderRepository;
import com.example.repository.StockReturnRepository;
//import com.example.security.Util.AuthUtil;
import com.example.security.service.JwtClaimService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
public class InventoryService {

//    private final AuthUtil authUtil;

    private final PurchaseOrderMapper  purchaseOrderMapper;

    private final UserInternalService  userInternalService;

    private final JwtClaimService jwtClaimService;

    private final StockReturnRepository  stockReturnRepository;

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final PurchaseOrderItemRepository  purchaseOrderItemRepository;

    private final ExportPurchaseOrderPdfFile exportPurchaseOrderPdfFile;

    private void reCalculatePurchaseOrder(PurchaseOrder purchaseOrder) {

        int totalQuantity = 0;

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (PurchaseOrderItem item : purchaseOrder.getItems()) {
            totalQuantity += item.getQuantityOrdered();
            totalPrice = totalPrice.add(
                    item.getCostPrice().multiply(BigDecimal.valueOf(item.getQuantityOrdered()))
            );
        }

        purchaseOrder.setTotalQuantity(totalQuantity);

        purchaseOrder.setTotalPrice(totalPrice);
    }

    public Page<GetPurchaseOrderRes> getPurchaseOrder(String keyword,
                                                      String status,
                                                      String orderDateFrom,
                                                      String orderDateTo,
                                                      Pageable pageable){



        Specification<PurchaseOrder> spec = InventorySpecification.from(

                InventorySpecification.PurchaseOrderFilter.forSearchSortFilter(
                        keyword, status, orderDateFrom, orderDateTo)
        );

        return purchaseOrderRepository
                .findAll(spec, pageable)
                .map(inventory -> purchaseOrderMapper.toGetPurchaseOrder(inventory));

    }

    @Transactional
    public GetPurchaseOrderDetailRes getPurchaseOrderDetail(String purchaseOrderId) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository
                .findWithItemsByPurchaseOrderId(purchaseOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_NOT_FOUND));

        return purchaseOrderMapper.toGetPurchaseOrderDetail(purchaseOrder);
    }

    @Transactional
    public CreatePurchaseOrderRes createPurchaseOrder(CreatePurchaseOrderReq req){

        PurchaseOrder purchaseOrder = PurchaseOrder.builder()
                .poCode(req.getPoCode())
                .supplierName(req.getSupplierName())
                .note(req.getNote())
                //TODO FIX CREATED BY
                .createdBy("Fong")
                .status(PurchaseOrderStatus.DRAFTED)
                .orderDate(LocalDateTime.now())
                .build();

        purchaseOrderRepository.save(purchaseOrder);

        return purchaseOrderMapper.toCreatePurchaseOrder(purchaseOrder);
    }

    public CreateItemInPurchaseOrderRes createItemInPurchaseOrder(String purchaseOrderId,
                                                                  List<CreateItemInPurchaseOrderReq> items) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository
                .findById(purchaseOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_NOT_FOUND));

        List<PurchaseOrderItem> purchaseItemsOrder = items.stream()
                .map( req -> PurchaseOrderItem.builder()
                        .purchaseOrder(purchaseOrder)
                        .productName(req.getProductName())
                        .productCode(req.getProductCode())
                        .productVolume(req.getProductVolume())
                        .colorName(req.getColorName())
                        .supplierName(req.getSupplierName())
                        .quantityOrdered(req.getQuantityOrdered())
                        .costPrice(req.getCostPrice())
                        .note(req.getNote())
                        .build())
                .toList();

        purchaseOrderItemRepository.saveAll(purchaseItemsOrder);

        purchaseOrder.setStatus(PurchaseOrderStatus.RECEIVED);

        purchaseOrder.setReceivedDate(LocalDateTime.now());

        purchaseOrder.getItems().addAll(purchaseItemsOrder);

        reCalculatePurchaseOrder(purchaseOrder);

        PurchaseOrder updatePurchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        return purchaseOrderMapper.toCreateItemRes(updatePurchaseOrder);
    }

    @Transactional
    public byte[] exportPurchaseOrderPdfFile(String purchaseOrderId){

        GetPurchaseOrderDetailRes order = getPurchaseOrderDetail(purchaseOrderId);

        return exportPurchaseOrderPdfFile.export(order);
    }

    public void deletePurchaseItemOrderById(String itemId){

        PurchaseOrderItem purchaseOrderItem = purchaseOrderItemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_NOT_FOUND));

        purchaseOrderItemRepository.deleteById(itemId);
    }

    public void deletePurchaseById(String purchaseOrderId){

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(purchaseOrderId)
                .orElseThrow(() -> new AppException(ErrorCode.PURCHASE_ORDER_NOT_FOUND));

        purchaseOrderRepository.deleteById(purchaseOrderId);
    }

}
