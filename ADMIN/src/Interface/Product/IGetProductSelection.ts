export type IGetProductSelectionResponse = {
    productId: string,
    productName: string,
    productQuantity: number;
    productPrice: number;
    supplierName?: string;
}[];