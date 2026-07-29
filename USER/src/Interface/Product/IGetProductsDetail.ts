import type { ChemicalDetailData } from "./IProductType/IChemicalDetail";
import type { PaintDetailData } from "./IProductType/IPaintDetailt";
import type { ToolDetailData } from "./IProductType/IToolDetail";

export type PublicProductDetail = {
  productId: string;
  productName: string;
  productDescription?: string;
  productImage: string[];
  productPrice: number;
  productQuantity: number;
  supplierName: string;
  colorName?: string;
  colorCode?: string;
  productVolume?: string;
  productUnit?: string;
  productCode?: string;
  categoryName?: string;
  discount?: number;
  createAt?: string;
  updateAt?: string;
  // Giả định (suy theo mockup, chưa xác nhận có thật trong response) —
  soldCount?: number;
  paintDetail?: PaintDetailData;
  toolDetail?: ToolDetailData;
  chemicalDetail?: ChemicalDetailData;
}