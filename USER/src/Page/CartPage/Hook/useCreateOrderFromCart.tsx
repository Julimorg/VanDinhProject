import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IGetOrderDetailResponse } from "../../../Interface/Order/IGetOrderDetail";
import { order_api } from "../../../Api/Api_Handler/order_api";

type UseCreateOrderFromCartOptions = Omit<
  UseMutationOptions<IApiResponse<IGetOrderDetailResponse>, Error, void>,
  "mutationFn"
>;

export const useCreateOrderFromCart = (
  userId: string,
  cartId: string,
  options?: UseCreateOrderFromCartOptions
) => {
  return useMutation<IApiResponse<IGetOrderDetailResponse>, Error, void>({
    mutationFn: () => order_api.CreateOrderFromCartd(userId, cartId),
    ...options,
  });
};
