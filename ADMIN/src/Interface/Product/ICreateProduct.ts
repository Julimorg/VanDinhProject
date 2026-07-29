
export type ProductType = 'PAINT' | 'TOOL' | 'CHEMICAL';

export type ICreateProductRequest = {
  productName: string;
  productDescription: string;
  productImage: File[];
  productCode: string;
  productQuantity: number;
  discount?: number;
  productPrice: number;
  productType: ProductType;
  supplierId: string;
  categoryId: string;

  // Paint fields
  colorId?: string;
  surfaceType?: string;
  volume?: string;

  // Tool fields
  toolType?: string;
  toolSize?: string;

  // Chemical fields
  chemicalType?: string;
  chemicalVolume?: string;

  // Extra
  extraSpecs?: string;
};

export type ICreateProductResponse = {
  productId: string;
  productName: string;
  productDescription: string;
  productImage: File[];
  productCode: string;
  productQuantity: number;
  discount?: number;
  productPrice: number;
  productType: ProductType;
  supplierId: string;
  categoryId: string;

  // Paint fields
  colorId?: string;
  surfaceType?: string;
  volume?: string;

  // Tool fields
  toolType?: string;
  toolSize?: string;

  // Chemical fields
  chemicalType?: string;
  chemicalVolume?: string;

  // Extra
  extraSpecs?: string;

  createAt: string;
  updateAt: string;
};