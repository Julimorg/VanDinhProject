
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { ICreateSupplierRequest, ICreateSupplierResponse } from "@/Interface/Supplier/ICreateSupplier";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";


type UseCreateSupplierOptions = Omit<
  UseMutationOptions<
    IApiResponse<ICreateSupplierResponse>,
    Error,
    ICreateSupplierRequest
  >,
  "mutationFn"
>;

export const useCreateSupplier = (options?: UseCreateSupplierOptions) => {


  return useMutation({
    mutationFn: (body: ICreateSupplierRequest) => docApi.CreateSupplier(body),
    ...options,
  });
};