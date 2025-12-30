import { useMutation } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IGetCartResponse } from "../../../Interface/Cart/IGetCart";
import { cart_api } from "../../../Api/Api_Handler/cart_api";

export const useUpdateCartItemQuantity = (options?: {
  onSuccess?: (data: IApiResponse<IGetCartResponse>) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      cart_api.UpdateCartItemQuantity(cartItemId, quantity),
    ...options,
  });
};
