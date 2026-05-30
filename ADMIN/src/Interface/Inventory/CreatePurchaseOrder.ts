export type ICreatePurchaseOrderRequest = {
    
    poCode: string;
   
    supplierName: string;

    note: string;

}

export type ICreatePurchaseOrderResponse = {

    purchaseOrderId: string;

    poCode: string;

    supplierName: string;

    note: string;

    status: string;

    createBy: string;

    createdAt: string;

    orderDate: string;
}