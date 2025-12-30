import type { IGetAllColor } from "../../Interface/Color/IGetAllColor";
import type { IApiResponse } from "../../Interface/IApiResponse";
import type { IApiResponsePagination } from "../../Interface/IApiResponsePagination";
import axiosClient from "../Axios/axiosClient";

export const color_api = {
    GetAllColor: async (
      params: {
        supplierName?: string,
        keyword?: string,
        page?: number,
        size?: number,
        sort?: string,
      } = {}
    ): Promise<IApiResponse<IApiResponsePagination<IGetAllColor>>> => {

      const {
        supplierName,
        keyword,
        page = 1,
        size = 5,
        sort = 'createAt, desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort,
        ...(keyword && { keyword }),
        ...(supplierName && { supplierName })
      })

      const url = `/color/get-color?${queryParams.toString()}`;
      const res = await axiosClient.get(url);
      return res.data;
    },
}