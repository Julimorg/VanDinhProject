export type IUpdatePurchaseOrder = {
  
  poCode: string;
  supplierName: string;
  note: string;
  status: string;
}

export type IUpdatePurchaseOrderResponse = {

     poCode: string;

    supplierName: string;

    note: string;

    status: string;

    orderDate: string;

    receivedDate: string;

    updateDate: string;
}