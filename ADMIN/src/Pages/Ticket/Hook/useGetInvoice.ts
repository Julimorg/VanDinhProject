import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";

import { OrderResponse } from "@/Interface/SendOder";

type UseGetinvoiceOption = Omit<
  UseQueryOptions<OrderResponse, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetinvoice = (
  id: string,
 options?: UseGetinvoiceOption
) => {
  return useQuery({
    ...options,
    queryKey: [QueryKeys.INVOICE, id, ],
    queryFn: () => docApi.getInvoice(id),
    enabled: !!id ,
  });
};