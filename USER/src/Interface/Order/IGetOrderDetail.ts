export interface IGetOrderDetailResponse {
  orderId: string;
  orderCode: string;
  status: string; 
  amount: number;
  id: string; 
  userName: string;
  email: string;
  phone: string;
  userAddress: string;
  shipAddress: string;
  paymentMethodStatus: 'Pending' | 'Paid' | 'Failed' | 'Canceled' | null;
  paymentMethod: 'CASH' | 'VN_PAY' | 'PAY_PAL' | null;
  items: IOrderItemDetail[];
  createBy: string;
  createAt: string; 
  updateAt: string; 
}

export interface IOrderItemDetail {
  orderItemId: string;
  productName: string; 
  productPrice: number;
  productImage: string[];
  productCode: string;
  categoryName: string;
  productVolume: string;
  colorName: string;
  productUnit: string;
  productQuantity: number;
  quantity: number;
}