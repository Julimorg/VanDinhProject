import type { ISearchAllResponse } from "../../Interface/Elasticsearch/ISearchAll"
import type { IApiResponse } from "../../Interface/IApiResponse"
import type { IApiResponsePagination } from "../../Interface/IApiResponsePagination"
import axiosClient from "../Axios/axiosClient";

export const elasticsearch_api = {
    SearchAll: async (
    params: {
        keyword?: string,
        page?: number,
        size?: number,
    } = {}
    ): Promise <IApiResponse<IApiResponsePagination<ISearchAllResponse>>> =>{
        const {
            keyword,
            page = 1,
            size = 10,
        } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            ...(keyword && { keyword }),
        })
        
        const url = `/elasticsearch/search-all?${queryParams.toString()}`;
        const res = await axiosClient.get(url);
        return res.data;
    }
}