import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import axiosClient from "./axiosClient";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetAllProductResponse } from "@/Interface/Product/IGetAllProducts";
import { IGetProductDetailResponse } from "@/Interface/Product/IGetProductsDetail";
import { IGetProductSelectionResponse } from "@/Interface/Product/IGetProductSelection";
import { IGetSupplierSelectionResponse } from "@/Interface/Supplier/IGetSupplierSelection";
import { IGetCategorySelectionResponse } from "@/Interface/Category/IGetCategorySelection";


export const docApi = {

    // * =================== CATEGORY =================== * //


    GetCategorySelection: async (): Promise<IApiResponse<IGetCategorySelectionResponse>> => {
        const url = `/public/select-categories`;
        const res = await axiosClient.get(url);
        return res.data;
    },


    // * =================== SUPPLIER =================== * //


    GetSupplierSelection: async (): Promise<IApiResponse<IGetSupplierSelectionResponse>> => {
        const url = `/public/select-suppliers`;
        const res = await axiosClient.get(url);
        return res.data;
    },


    // * =================== PRODUCT =================== * //
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
            sort = 'productPrice,desc'
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
        const url = `/public/get-products?${queryParams.toString()}`;
        const res = await axiosClient.get(url);
        return res.data;
    },

    GetProducDetail: async (productId: string): Promise<IApiResponse<IGetProductDetailResponse>> => {
        const url = `/public/detail-product/${productId}`;
        const res = await axiosClient.get(url);
        return res.data;
    },

    GetProductSelection: async (
        params: {
            keyword?: string,
            categoryName?: string,
            supplierName?: string,
            minPrice?: number,
            maxPrice?: number,
        } = {}
    ): Promise<IApiResponse<IGetProductSelectionResponse>> => {

        const {
            keyword,
            categoryName,
            supplierName,
            minPrice,
            maxPrice,
        } = params;

        const queryParams = new URLSearchParams({
            ...(keyword && { keyword }),
            ...(categoryName && { categoryName }),
            ...(supplierName && { supplierName }),
            ...(typeof minPrice === 'number' && !isNaN(minPrice) && { minPrice: minPrice.toString() }),
            ...(typeof maxPrice === 'number' && !isNaN(maxPrice) && { maxPrice: maxPrice.toString() }),

        })
        const url = `/products/select-products?${queryParams.toString()}`;
        const res = await axiosClient.get(url);
        return res.data;
    },

}