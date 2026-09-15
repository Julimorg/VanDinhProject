
import type { IGetAllColor } from "@/Interface/Color/IGetAllColor";
import type { IApiResponse } from "../../Interface/IApiResponse";
import type { IApiResponsePagination } from "../../Interface/IApiResponsePagination";
import axiosClient from "../Axios/axiosClient";

export const color_api = {
    GetAllColor: async (
    supplierId: string,
    params: {
      keyword?: string;
      page?: number;
      size?: number;
      sort?: string;
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IGetAllColor>>> => {
    const { keyword, page = 1, size = 10, sort = 'createAt, desc' } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(keyword && { keyword }),
    });

    const url = `/color/get-color/${supplierId}?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
}