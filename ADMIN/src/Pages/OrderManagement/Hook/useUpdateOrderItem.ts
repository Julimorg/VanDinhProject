import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IUpdateOrderItemRequest, IUpdateOrderItemResponse } from "@/Interface/Order/IUpdateOrderItem";

type UseUpdateOrderItemOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateOrderItemResponse>,
    Error,
    IUpdateOrderItemRequest
  >,
  "mutationFn"
>;

export const useUpdateOrderItem = (orderId: string, options?: UseUpdateOrderItemOptions) => {
    return useMutation({
        mutationFn: (body: IUpdateOrderItemRequest) => docApi.UpdateOrderItem(orderId, body),
        ...options,
    })
}