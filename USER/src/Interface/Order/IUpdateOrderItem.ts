export type IUpdateOrderItemRequest = {
  orderItems: {
    orderItemId?: string;
    productId: string;
    quantity: number;
  }[];
};

export type IUpdateOrderItemResponse = {
  orderItemId: string;
  productId?: string;
  quantity: number;
  price?: number;
  updateAt: string;
}[];