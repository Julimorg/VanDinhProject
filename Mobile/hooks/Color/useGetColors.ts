import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetAllColor } from "@/Interface/Color/IGetAllColor";
import { QueryKeys } from "@/constants/query-key";

type ColorsQueryParams = {
  supplierName?: string;
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
  params: ColorsQueryParams = {},
  options?: UseGetColorsOptions
) => {
  const { supplierName, page = 0, size = 5, sort = "createAt,desc", keyword } = params;

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_COLORS, { supplierName, page, size, sort, keyword }],
    queryFn: () => docApi.GetAllColor({ supplierName, page, size, sort, keyword }),
    enabled: true, 
  });
};