export interface Product {
  productId: string;
  productName: string;
  productImage: string[];  // List<String>
  productVolume: string;
  productUnit: string;
  ProductCode: string;
  productQuantity: number;
  productPrice: number;    // BigDecimal -> number cho đơn giản
  supplierName: string;
  colorName: string;
  categoryName: string;
  createAt: string;
  updateAt: string;
}