export type IUpdateOrderRequest = {
    shipAddress: string,
    paymentMethod: 'CASH' | 'VN_PAY' | 'PAY_PAL';
    id?: string;
}

export type IUpdateOrderResponse  = {
    orderId: string;
    orderCode: string;
    orderStatus: string;
    orderAmount: number;
    shipAddress: string;
    updateAt: string,
    id: string;
}