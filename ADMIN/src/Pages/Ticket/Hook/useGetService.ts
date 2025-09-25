import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { TServiceItem } from "@/Interface/TServiceItems";

type UseServiceOptions = Omit<
  UseQueryOptions<TServiceItem, unknown>,
  "queryKey" | "queryFn"
>;

export const useService = (
  id: string,
  typeOfCustomer: string,
  is_Available:string,

  options?: UseServiceOptions
) => {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.SERVICE, id, typeOfCustomer],
    queryFn: () => docApi.getService(id, typeOfCustomer,is_Available),
    enabled: !!id && !!typeOfCustomer, 
  });
};