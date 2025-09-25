import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { GetDiscountServiceResponse } from "@/Interface/TDiscountService";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";


type UseGetDiscountServiceOptions = Omit<
  UseQueryOptions<GetDiscountServiceResponse, Error>,
  "queryKey" | "queryFn"
>;

export const useGetDiscountService = (options?: UseGetDiscountServiceOptions) => {
  return useQuery<GetDiscountServiceResponse, Error>({
    ...options,
    queryKey: [QueryKeys.SERVICEDISCOUNT],
    queryFn: () => docApi.getdiscountservice(),
  });
};
