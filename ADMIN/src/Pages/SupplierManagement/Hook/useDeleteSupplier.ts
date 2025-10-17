
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";

type UseDeleteSupplierOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    string 
  >,
  "mutationFn"
>;

export const useDeleteSupplier = (options?: UseDeleteSupplierOptions) => {
  
  return useMutation({
    mutationFn: (supplierId: string) => docApi.DeleteSupplier(supplierId),
    ...options,
  });
};