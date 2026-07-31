import type { PublicProductDetail } from "@/Interface/Product/IGetProductsDetail";
import type { IApiResponse } from "../../Interface/IApiResponse";
import type { IApiResponsePagination } from "../../Interface/IApiResponsePagination";
import type { IGetAllProductResponse } from "../../Interface/Product/IGetAllProducts";
import type { IGetProductNewArrival } from "../../Interface/Product/IGetProductNewArrival";
import axiosClient from "../Axios/axiosClient";

export const product_api = {
    GetProductNewArrvial: async(): Promise<IApiResponse<IGetProductNewArrival>> => {
      const url = '/products/new-arrival';
      const res = await axiosClient.get(url);
      return res.data;
    },

    GetAllProducts: async (
    params: {
      keyword?: string,
      categoryName?: string,
      supplierName?: string,
      minPrice?: number,
      maxPrice?: number,
      page?: number,
      size?: number,
      sort?: string
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IGetAllProductResponse>>> => {

    const {
      keyword,
      categoryName,
      supplierName,
      minPrice,
      maxPrice,
      page = 1,
      size = 5,
      sort = 'createAt,desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(keyword && { keyword }),
      ...(categoryName && { categoryName }),
      ...(supplierName && { supplierName }),
      ...(typeof minPrice === 'number' && !isNaN(minPrice) && { minPrice: minPrice.toString() }),
      ...(typeof maxPrice === 'number' && !isNaN(maxPrice) && { maxPrice: maxPrice.toString() }),

    })
    const url = `/products/get-products?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetProducDetail: async (productId: string): Promise<IApiResponse<PublicProductDetail>> => {
    const url = `/products/detail-product/${productId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
}