

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import type { CodeRemoveRs, DiscountCodeUpdate } from "@/Interface/TDiscountCode";

type UseCreateDiscountCodeOptions = UseMutationOptions<
  CodeRemoveRs,      
  Error,             
  DiscountCodeUpdate   
>;

export const useCreateDiscountCode = (
  options?: UseCreateDiscountCodeOptions
) => {
  return useMutation({
    mutationFn: (body: DiscountCodeUpdate) => docApi.createDiscountCode(body),
    ...options,
  });
};
