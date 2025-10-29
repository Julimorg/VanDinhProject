export type ICreateOrderRequest = {
    id: string;
    shipAddress: String;
    paymentMethod: 'CASH' | 'VN_PAY' | 'PAY_PAL';
    orderItems: { productId: string; quantity: number }[];
}

export type ICreateOrderResponse = {
    orderId: string;
    orderCode: string;
    orderStatus: string;
    orderAmount: number;
    shipAddress: string;
    firstName: string;
    createAt: string,
    updateAt: string,
    
}