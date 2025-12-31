export type ICreateColorRequest = {
    colorName: string,
    colorCode: string,
    colorDescription: string,
    colorImg: File,
    supplierId: string,
}

export type ICreateColorResponse = {
    colorId: string,
    colorName: string,
    colorCode: string,
    colorDescription: string,
    colorImg: File,
    supplier: ColorSupplier[],
    createAt: string,
}

export type ColorSupplier = {
    supplierId: string,
    supplierName: string,
}