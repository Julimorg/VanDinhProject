import type { IApiResponse } from "../../Interface/IApiResponse";
import type { IApiResponsePagination } from "../../Interface/IApiResponsePagination";
import type { IConfirmOrderRequest, IConfirmOrderResponse } from "../../Interface/Order/IConfirmOrder";
import type { IGetMyListOrder } from "../../Interface/Order/IGetMyListOrder";
import type { IGetOrderDetailResponse } from "../../Interface/Order/IGetOrderDetail";
import axiosClient from "../Axios/axiosClient";

export const order_api = {

    ConfirmOrder: async(body: IConfirmOrderRequest, userId: string, orderId: string): Promise<IApiResponse<IConfirmOrderResponse>> => {
        const url = `/order/confirm-order/${userId}/${orderId}`;
        const res = await axiosClient.patch(url, body);
        return res.data;
    },

    CreateOrderFromCartd: async(userId: string, cartId: string): Promise<IApiResponse<IGetOrderDetailResponse>> => {
        const url = `/order/from-cart/${userId}/${cartId}`;
        const res = await axiosClient.post(url); 
        return res.data;
    },

    GetOrderDetail: async (orderId: string): Promise<IApiResponse<IGetOrderDetailResponse>> => {
        const url = `/order/order-detail/${orderId}`;
        const res = await axiosClient.get(url);
        return res.data;
    },
    
    GetMyListOrder: async (
        userId: string,
        params: {
            keyword?: string,
            status?: string,
            page?: number,
            size?: number,
            sort?: string,
        } = {}
    ): Promise<IApiResponse<IApiResponsePagination<IGetMyListOrder>>> => {
        const { keyword, status, page = 1, size = 5, sort = 'createAt, desc' } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort,
            ...(keyword && { keyword }),
            ...(status && { status }),
        });

        const url = `/order/list-orders/${userId}?${queryParams.toString()}`;
        const res = await axiosClient.get(url);
        return res.data;
    }
}