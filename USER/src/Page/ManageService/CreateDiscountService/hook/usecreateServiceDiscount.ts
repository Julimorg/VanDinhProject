import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { CreateDiscountService, DiscountServiceRs } from "@/Interface/TDiscountService";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type UseCreateServiceDiscountOptions = Omit<
  UseMutationOptions<DiscountServiceRs, unknown, CreateDiscountService>,
  "mutationFn"
>;

export const useCreateServiceDiscount = (
  options?: UseCreateServiceDiscountOptions
) => {
  return useMutation({
    ...options,
    mutationFn: (body: CreateDiscountService) => docApi.createServiceDiscount(body),
    mutationKey: [QueryKeys.CREATEDISCOUNTSERVICE],
  });
};
