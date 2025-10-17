
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IUpdateSupplierRequest, IUpdateSupplierResponse } from "@/Interface/Supplier/IUpdateSupplier";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";


type UseUpdateSupplierOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateSupplierResponse>,
    Error,
    IUpdateSupplierRequest
  >,
  "mutationFn"
>;

export const useUpdateSupplier = (supplierId: string, options?: UseUpdateSupplierOptions) => {
  
  return useMutation({
    mutationFn: (body: IUpdateSupplierRequest) => docApi.UpdateSupplier(supplierId, body),
    ...options,
  });
};