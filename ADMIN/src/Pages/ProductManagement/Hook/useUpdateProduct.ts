import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IUpdateProductRequest, IUpdateProductResponse } from "@/Interface/Product/IUpdateProduct";

type UseUpdateProductOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateProductResponse>,
    Error,
    IUpdateProductRequest
  >,
  "mutationFn"
>;

export const useUpdateProduct = (productId: string, options?: UseUpdateProductOptions) => {
    return useMutation({
        mutationFn: (body: IUpdateProductRequest) => docApi.UpdateProduct(productId, body),
        ...options,
    })
}