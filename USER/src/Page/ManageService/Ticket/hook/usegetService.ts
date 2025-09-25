import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { TServiceListResponse } from "@/Interface/TServiceItems";


type UseServiceOptions = Omit<
  UseQueryOptions<TServiceListResponse, unknown>,
  "queryKey" | "queryFn"
>;

export const useService = (
  id: string,
  typeOfCustomer: string,
  is_Available: string,
  page: string,
  limit: string,
  options?: UseServiceOptions
) => {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.SERVICE, id, typeOfCustomer, is_Available, page, limit],
    queryFn: () => docApi.getService(id, typeOfCustomer, is_Available, page, limit),
    enabled: !!id && !!typeOfCustomer,
  });
};