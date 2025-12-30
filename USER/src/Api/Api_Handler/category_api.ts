import type { IGetCategorySelectionResponse } from "../../Interface/Category/IGetCategorySelection";
import type { IApiResponse } from "../../Interface/IApiResponse";
import axiosClient from "../Axios/axiosClient";

export const category_api = {
    GetCategorySelection: async (): Promise<IApiResponse<IGetCategorySelectionResponse>> => {
        const url = `/categories/select-categories`;
        const res = await axiosClient.get(url);
        return res.data;
    },
}