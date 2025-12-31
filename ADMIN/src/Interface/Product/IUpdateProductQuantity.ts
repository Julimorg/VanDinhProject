export type IUpdateProductQuantityRequest = {
    productQuantity: number,
}

export type IUpdateProductQuantityResponse  = {
    productId: string,
    productName: string,
    productDescription: string,
    productImage: File[],
    productVolume: string,
    productUnit: string,
    productCode: string,
    productQuantity: number,
    discount?: number,
    productPrice: number,
    supplierId: string,
    colorId: string,
    categoryId: string,
    createAt: string,
    updateAt: string,
}