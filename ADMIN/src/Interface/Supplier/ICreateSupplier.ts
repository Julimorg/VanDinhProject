export type ICreateSupplierRequest = {
    supplierName: string,
    supplierAddress: string,
    supplierPhone: string,
    supplierEmail: string,
    supplierImg: File
}

export type ICreateSupplierResponse = {
    supplierId: string, 
    supplierNme: string,
    supplierAddress: string,
    supplierPhone: string,
    supplierEmail: string,
    supplierImg: File,
    createAt: string,
}