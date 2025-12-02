import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IApiResponsePagination } from "../../../Interface/IApiResponsePagination";
import { QueryKeys } from "../../../Constant/query-key";
import { docApi } from "@/Api/docApi";
import { IUserOrderResponse } from "@/Interface/Order/IUserOrder";


type OrderHistoryQueryParams = {
    keyword?: string;
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
}

type OrderHistoryOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IUserOrderResponse>>, unknown>,
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
    queryKey: [QueryKeys.GET_USER_ORDER_HISTORY, { keyword, status, page, size, sort }], 
    queryFn: () => docApi.GetUserListOrder(userId, { keyword, status, page, size, sort }),
    enabled: true, 
  })};