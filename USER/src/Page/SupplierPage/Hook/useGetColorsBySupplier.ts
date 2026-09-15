import { color_api } from "@/Api/Api_Handler/color_api";
import { QueryKeys } from "@/Constant/query-key";
import type { IGetAllColor } from "@/Interface/Color/IGetAllColor";
import type { IApiResponse } from "@/Interface/IApiResponse";
import type { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

type ColorsQueryParams = {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
};

type UseGetColorsOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IGetAllColor>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetColors = (
  supplierId?: string,
  params: ColorsQueryParams = {},
  options?: UseGetColorsOptions
) => {
  const { page = 0, size = 5, sort = "createAt,desc", keyword } = params;

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_COLOR_BY_SUPPLIER, supplierId, {page, size, sort, keyword }],
    queryFn: () => color_api.GetAllColor(supplierId!, { page, size, sort, keyword }),
    enabled: true, 
  });
};