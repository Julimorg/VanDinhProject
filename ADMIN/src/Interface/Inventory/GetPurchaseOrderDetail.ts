export type IGetPurchaseOrderDetailResponse = { 
    purchaseOrderId: string;

    poCode: string;

    supplierName: string;

    note: string;

    createdBy: string;

    totalPrice: number;

    totalQuantity: number;

    status: string;

    orderDate: string;

    createAt: string;

    updateAt: string;

    items: ListPurchaseItemOrder[];

}

export type ListPurchaseItemOrder = {
    
    itemId: string;

    productId: string;

    productName: string;

    productCode: string;

    productVolume: string;

    colorName: string;

    supplierName: string;

    quantityOrdered: number;

    costPrice: number;

    expiryDate: string;

    note: string;

    createAt: string;

    updateAt: string;
}