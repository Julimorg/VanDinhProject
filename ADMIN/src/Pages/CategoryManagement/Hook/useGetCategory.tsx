import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IGetAllCategoryResponse } from "@/Interface/Category/IGetAllCategories";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type CategoryQueryParams = {
    keyword?: string;
    page?: number;
    size?: number;
    sort?: string;
}

type UseCategoryOptions = Omit<
    UseQueryOptions<IApiResponse<IApiResponsePagination<IGetAllCategoryResponse>>, unknown>,
    "queryKey" | "queryFn"
>;

export const useGetAllCategory = (
    params: CategoryQueryParams = {},
    options?: UseCategoryOptions
) => {
    const {keyword, page = 0, size = 5, sort = "createAt,desc" } = params;
    return useQuery({
        ...options,
        queryKey: [QueryKeys.GET_CATEGORY, {keyword, page, size, sort }],
        queryFn: () => docApi.GetAllCategory({keyword, page, size, sort }),
        enabled: true,
    });
}