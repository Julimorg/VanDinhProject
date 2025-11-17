import type { OrderStatus } from "../../Enum/OrderStatus";

export type IGetMyListOrder = {
    orderId: string;
    orderCode: string;
    shipAddress: string;
    total_quantity: number;
    orderAmount: number;
    orderStatus: OrderStatus;
    paymentMethod: string;
    createAt: string;
    updateAt: string;
    deletedAt: string;
    completeAt: string;
}