import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import type { CodeRemoveRs, DiscountCodeUpdate } from "@/Interface/TDiscountCode";

type UseUpdateDiscountCodeOptions = UseMutationOptions<
  CodeRemoveRs,      
  Error,             
  DiscountCodeUpdate   
>;

export const useUpdateDiscountCode = (
  id: string,
  options?: UseUpdateDiscountCodeOptions
) => {
  return useMutation({
    mutationFn: (body: DiscountCodeUpdate) => docApi.updateDiscountCode(id, body),
    ...options,
  });
};
