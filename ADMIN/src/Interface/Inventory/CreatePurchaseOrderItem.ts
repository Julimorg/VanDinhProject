export type ICreatePurchaseOrderItemRequest = {
    
    productName: string;

    productCode: string;

    productVolume: string;

    colorName: string;

    supplierName: string;

    quantityOrdered: number;

    costPrice: number;

    expiryDate: string;

    note: string;

}


export type ICreatePurchaseOrderItemResponse = {
    purchaseOrderItemId: string;
    poCode: string;
    status: string;
    receivedDate: string;
    items: IListItemByPurchaseOrderResponse[];
}

export type IListItemByPurchaseOrderResponse = {

    itemId: string;
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

}
