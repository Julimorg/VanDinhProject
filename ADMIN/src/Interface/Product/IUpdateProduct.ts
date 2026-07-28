export type IUpdateProductRequest = {
  productName: string;
  productDescription: string;
  productImage: File[];
  productVolume: string;
  productUnit: string;
  productCode: string;
  productType: string;
  productQuantity: number;
  discount?: number;
  productPrice: number;
  supplierId: string;
  categoryId: string;

  // PAINT
  colorId?: string;
  surfaceType?: string;
  volume?: string;

  // TOOL
  toolType?: string;
  toolSize?: string;

  // CHEMICAL
  chemicalType?: string;
  chemicalVolume?: string;


   extraSpecs?: string;
};

export type IUpdateProductResponse  = {
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