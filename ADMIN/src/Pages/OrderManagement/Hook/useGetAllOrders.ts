import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetAllOrderResponse } from "@/Interface/Order/IGetAllOrderResponse";
import { docApi } from "@/Api/docApi";

type OrdersQueryParams = {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
};

type UseOrdersOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IGetAllOrderResponse>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetAllOrders = (
  params: OrdersQueryParams = {},
  options?: UseOrdersOptions
) => {
  const {
    keyword,
    status,
    page = 1,
    size = 5,
    sort = "createAt,desc", 
  } = params;

  const cleanParams = {
    keyword,
    status,
    page,
    size,
    sort,
  };

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_ALL_ORDERS, cleanParams], 
    queryFn: () => docApi.GetAllOrder({
      keyword,
      status,
      page,
      size,
      sort,
    }),
    enabled: true,

  });
};