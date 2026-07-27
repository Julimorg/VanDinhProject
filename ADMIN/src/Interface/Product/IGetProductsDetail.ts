import { IChemicalDetail } from "./IProductType/IChemicalDetail";
import { IPaintDetail } from "./IProductType/IPaintDetailt";
import { IToolDetail } from "./IProductType/IToolDetail";

export type IGetProductDetailResponse = {
   productId: string,
   
   productName: string,
   
   productDescription: string,
   
   productImage: string[],
   
   productVolume: string,
   
   productUnit: string,
   
   productCode: string,

   productType: string,
   
   productQuantity: number,
   
   discount: number,
   
   productPrice: number,
   
   supplierName: string,
   
   colorName: string,
   
   categoryName: string,

   toolDetail: IToolDetail | null,
   
   paintDetail: IPaintDetail | null,

   chemicalDetail: IChemicalDetail | null,
   
   createAt: string,
   
   updateAt: string,
}