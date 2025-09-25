import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { DiscountCodeRs } from "@/Interface/TDiscountCode";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type UseGetDiscountCodeOptions = Omit<
  UseQueryOptions<DiscountCodeRs, Error>,
  "queryKey" | "queryFn"
>;

export const useGetDiscountCode = (
  page: number,
  limit: number,
  options?: UseGetDiscountCodeOptions
) => {
  return useQuery<DiscountCodeRs, Error>({
    ...options,
    queryKey: [QueryKeys.GETDISCOUNTCODE, page, limit],
    queryFn: () => docApi.getDiscountCode({ page, limit }),
  });
};
