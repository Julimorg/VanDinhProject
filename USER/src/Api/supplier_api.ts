import type { IApiResponse } from "../Interface/IApiResponse";
import type { IApiResponsePagination } from "../Interface/IApiResponsePagination";
import type { IGetAllSupplierResponse } from "../Interface/Supplier/IGetAllSuppliers";
import type { IGetSupplierSelectionResponse } from "../Interface/Supplier/IGetSupplierSelection";
import axiosClient from "./axiosClient";


export const supplier_api = {
    
    GetSupplierSelection: async (): Promise<IApiResponse<IGetSupplierSelectionResponse>> => {
        const url = `/supplier/select-suppliers`;
        const res = await axiosClient.get(url);
        return res.data;
    },

    GetAllSupplier: async (
        params: {
        keyword?: string,
        page?: number,
        size?: number,
        sort?: string,
        } = {}
    ): Promise<IApiResponse<IApiResponsePagination<IGetAllSupplierResponse>>> => {
        const { keyword, page = 1, size = 5, sort = 'createAt, desc' } = params;
        const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort,
        ...(keyword && { keyword }),
        });

        const url = `/supplier/get-suppliers?${queryParams.toString()}`;
        const res = await axiosClient.get(url);
        return res.data;
  },
}