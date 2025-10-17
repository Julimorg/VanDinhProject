export type IUpdateSupplierRequest = {
    supplierName: string,
    supplierAddress: string,
    supplierPhone: string,
    supplierEmail: string,
    supplierImg: File
}

export type IUpdateSupplierResponse = {
    supplierId: string, 
    supplierNme: string,
    supplierAddress: string,
    supplierPhone: string,
    supplierEmail: string,
    supplierImg: File,
    createAt: string,
}