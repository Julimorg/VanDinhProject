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
  productCode: string;
  productQuantity: number;
  quantity: number;
}
