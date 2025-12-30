
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { cart_api } from "../../../Api/Api_Handler/cart_api";
import type { IApiResponse } from "../../../Interface/IApiResponse";

type UseDeleteCartItemOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    string 
  >,
  "mutationFn"
>;

export const useDeleteCartItem = (options?: UseDeleteCartItemOptions) => {
  
  return useMutation({
    mutationFn: (cartItemId: string) => cart_api.DeleteCartItem(cartItemId),
    ...options,
  });
};