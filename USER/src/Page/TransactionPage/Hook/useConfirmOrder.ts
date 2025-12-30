import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { order_api } from "../../../Api/Api_Handler/order_api";
import type { IConfirmOrderResponse, IConfirmOrderRequest } from "../../../Interface/Order/IConfirmOrder";

type UseConfirmOrderOptions = Omit<
  UseMutationOptions<IApiResponse<IConfirmOrderResponse>, Error, IConfirmOrderRequest>,
  "mutationFn"
>;

export const useConfirmOrder = (
  userId: string,
  orderId: string,
  options?: UseConfirmOrderOptions
) => {
  return useMutation<
    IApiResponse<IConfirmOrderResponse>,
    Error,
    IConfirmOrderRequest
  >({
    mutationFn: (body) => order_api.ConfirmOrder(body, userId, orderId),
    ...options,
  });
};
