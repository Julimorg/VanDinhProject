export interface IGetOrderDetailResponse {
  orderId: string;
  orderCode: string;
  userId: string;
  status: string; 
  amount: number;
  id: string; 
  userName: string;
  email: string;
  phone: string;
  userAddress: string;
  shipAddress: string;
  paymentMethod: 'CASH' | 'VN_PAY' | 'PAY_PAL' | null;
  items: IOrderItemDetail[];
  createBy: string;
  createAt: string; 
  updateAt: string; 
}

export interface IOrderItemDetail {
  orderItemId: string;
  productName: string; 
  productImage: string[];
  colorName: string;
  productVolume: string;
  categoryName: string;
  productPrice: number;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  quantity: number;
}