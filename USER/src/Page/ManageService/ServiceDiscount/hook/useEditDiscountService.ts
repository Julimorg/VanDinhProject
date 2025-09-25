import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { EditDiscountService, DiscountServiceRs } from "@/Interface/TDiscountService";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";


type EditServiceDiscountVariables = {
  id: string;
  body: EditDiscountService;
};

type UseEditServiceDiscountOptions = UseMutationOptions<
  DiscountServiceRs,          
  unknown,                    
  EditServiceDiscountVariables 
>;

export const useEditServiceDiscount = (options?: UseEditServiceDiscountOptions) => {
  return useMutation({
    mutationKey: [QueryKeys.EDITDISCOUNTSERVICE],
    mutationFn: ({ id, body }: EditServiceDiscountVariables) =>
      docApi.editServiceDiscount(id, body),
    ...options,
  });
};
