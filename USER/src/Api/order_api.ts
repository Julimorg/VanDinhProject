import type { IApiResponse } from "../Interface/IApiResponse";
import type { IApiResponsePagination } from "../Interface/IApiResponsePagination";
import type { IGetMyListOrder } from "../Interface/Order/IGetMyListOrder";
import axiosClient from "./axiosClient";

export const order_api = {
    GetMyListOrder: async(
        userId: string,
        params: {
        status?: string,
        page?: number,
        size?: number,
        sort?: string,
        } = {}
    ): Promise<IApiResponse<IApiResponsePagination<IGetMyListOrder>>> => {
          const { status, page = 1, size = 5, sort = 'createAt, desc' } = params;
        const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort,
        ...(status && { status }),
        });

        const url = `/order/list-orders/${userId}&${queryParams.toString()}`;
        const res = await axiosClient.get(url);
        return res.data;
    }
}