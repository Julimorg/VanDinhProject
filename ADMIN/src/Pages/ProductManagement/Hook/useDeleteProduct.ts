
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";

type UseDeleteProductOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    string 
  >,
  "mutationFn"
>;

export const useDeleteProduct = (options?: UseDeleteProductOptions) => {
  
  return useMutation({
    mutationFn: (productId: string) => docApi.DeleteProduct(productId),
    ...options,
  });
};