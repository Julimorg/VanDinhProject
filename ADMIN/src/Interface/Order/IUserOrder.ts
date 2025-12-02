
export type IUserOrderResponse = {
  orderId: string;
  orderCode: string;
  shipAddress: string;
  total_quantity: number;
  orderAmount: number; 
  orderStatus: 'Pending' | 'Approved' | 'Canceled';
  paymentMethod: string;
  createAt: string;
  updateAt: string;
  deletedAt?: string | null;
  completeAt?: string | null;
}