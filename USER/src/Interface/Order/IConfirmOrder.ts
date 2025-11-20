export type IConfirmOrderRequest = {
    paymentMethod: string;
    shipAddress: string;
}


export type IConfirmOrderResponse = {
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
  paymentMethod: 'CASH' | 'VN_PAY' | null;
  items: IOrderItemDetail[];
  paymentStatus: string;
  paymentUrl: string;
  createBy: string;
  createAt: string; 
  updateAt: string; 
  deleteAt?: string;
  completeAt?: string;
}

export type IOrderItemDetail = {
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