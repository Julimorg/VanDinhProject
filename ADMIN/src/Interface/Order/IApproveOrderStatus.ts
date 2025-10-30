export type IApproveOrderStatusRequest = {
    orderStatus: string;
};

export type IApproveOrderStatusResponse = {
    orderId: string;
    orderCode: string;
    status: string;
    orderAmount: number;
    id: string;
    userName: string;
    email: string;
    phone: string;
    userAddress: string;
    shipAddress: string;
    paymentMethod: 'CASH' | 'VN_PAY' | 'PAY_PAL' | null;
    orderItems: IOrderItems[];
    createBy: string;
    createAt: string;
    updateAt: string;
    completeAt: string;
}


export interface IOrderItems {
    orderItemId: string;
    productName: string;
    quantity: number;
}