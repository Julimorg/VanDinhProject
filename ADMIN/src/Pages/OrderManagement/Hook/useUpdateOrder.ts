import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IUpdateOrderRequest, IUpdateOrderResponse } from "@/Interface/Order/IUpdateOrder";

type UseUpdateOrderOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateOrderResponse>,
    Error,
    IUpdateOrderRequest
  >,
  "mutationFn"
>;

export const useUpdateOrder = (orderId: string, options?: UseUpdateOrderOptions) => {
    return useMutation({
        mutationFn: (body: IUpdateOrderRequest) => docApi.UpdateOrder(orderId, body),
        ...options,
    })
}