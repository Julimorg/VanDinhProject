

import { productApi } from "@/Api/product";
import { QueryKeys } from "@/Constant/query-key";
import { useQuery } from "@tanstack/react-query";

export const useGetProductGate = () => {
  return useQuery({
    queryKey: [QueryKeys.PRODUCT_GATE],
    queryFn: () => productApi.getAll(),
    placeholderData: (previousData) => previousData,
    retry: 3,
    staleTime: 3 * 60 * 1000, // 3 minuets
  });
};
