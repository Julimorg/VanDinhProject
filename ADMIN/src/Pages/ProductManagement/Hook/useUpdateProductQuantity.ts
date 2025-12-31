import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IUpdateProductQuantityRequest, IUpdateProductQuantityResponse } from "@/Interface/Product/IUpdateProductQuantity";


type UseUpdateProductQuantityOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateProductQuantityResponse>,
    Error,
    IUpdateProductQuantityRequest
  >,
  "mutationFn"
>;

export const useUpdateProductQuantity = (productId: string, options?: UseUpdateProductQuantityOptions) => {
    return useMutation({
        mutationFn: (body: IUpdateProductQuantityRequest) => docApi.UpdateProductQuantity(productId, body),
        ...options,
    })
}