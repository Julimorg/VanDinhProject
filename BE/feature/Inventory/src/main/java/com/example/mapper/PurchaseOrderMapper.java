package com.example.mapper;

import com.example.common.dto.inventory.request.CreatePurchaseOrderReq;
import com.example.common.dto.inventory.response.*;
import com.example.persistence.entity.PurchaseOrder;
import com.example.persistence.entity.PurchaseOrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PurchaseOrderMapper {

    //** ===============================   GET RESPONSE   ===========================

    GetPurchaseOrderRes toGetPurchaseOrder(PurchaseOrder purchaseOrder);

    ListPurchaseItemOrder toOneItemRes(PurchaseOrderItem purchaseOrderItem);

    List<ListPurchaseItemOrder> toListItemsRes(List<PurchaseOrderItem> purchaseOrderItems);

    @Mapping(source = "items", target = "items")
    GetPurchaseOrderDetailRes toGetPurchaseOrderDetail(PurchaseOrder purchaseOrder);

    //** ===============================   CREATE RESPONSE   ===========================

    CreatePurchaseOrderRes toCreatePurchaseOrder(PurchaseOrder purchaseOrder );

    ListItemsInPurchaseOrderAfterCreate toItemRes(PurchaseOrderItem item);

    List<ListItemsInPurchaseOrderAfterCreate> toItemResList(List<PurchaseOrderItem> items);

    @Mapping(source = "items", target = "items")
    CreateItemInPurchaseOrderRes toCreateItemRes(PurchaseOrder purchaseOrder);

}
