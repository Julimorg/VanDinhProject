
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { ICreateProductRequest, ICreateProductResponse } from "@/Interface/Product/ICreateProduct";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";


type UseCreateProductOptions = Omit<
  UseMutationOptions<
    IApiResponse<ICreateProductResponse>,
    Error,
    ICreateProductRequest
  >,
  "mutationFn"
>;

export const useCreateProduct = (options?: UseCreateProductOptions) => {


  return useMutation({
    mutationFn: (body: ICreateProductRequest) => docApi.CreateProduct(body),
    ...options,
  });
};