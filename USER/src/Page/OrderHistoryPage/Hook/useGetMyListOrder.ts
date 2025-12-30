import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IApiResponsePagination } from "../../../Interface/IApiResponsePagination";
import type { IGetMyListOrder } from "../../../Interface/Order/IGetMyListOrder";
import { QueryKeys } from "../../../Constant/query-key";
import { order_api } from "../../../Api/Api_Handler/order_api";


type OrderHistoryQueryParams = {
    keyword?: string;
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
}

type OrderHistoryOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IGetMyListOrder>>, unknown>,
  "queryKey" | "queryFn"
>;


export const useGetMyListOrder = (
  userId: string,
  params: OrderHistoryQueryParams = {},
  options?: OrderHistoryOptions
) => {
  const { keyword, status, page = 0, size = 5, sort = "createAt,desc" } = params; 

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_MY_ORDER_HISTORY, { keyword, status, page, size, sort }], 
    queryFn: () => order_api.GetMyListOrder(userId, { keyword, status, page, size, sort }),
    enabled: true, 
  })};