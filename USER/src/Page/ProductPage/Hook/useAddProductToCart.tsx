import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IAddProductToCartRequest, IAddProductToCartResponse } from "../../../Interface/Cart/IAddProductToCart";
import { cart_api } from "../../../Api/cart_api";

type UseAddProductToCartOptions = Omit<
  UseMutationOptions<
    IApiResponse<IAddProductToCartResponse>,
    Error,
    IAddProductToCartRequest
  >,
  "mutationFn"
>;

export const useAddProductToCart = (userId: string, options?: UseAddProductToCartOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: IAddProductToCartRequest) => cart_api.AddProductToCart(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Add Product To Cart'] });
    },
    onError: () => {
      console.log("Create user error");
    },
    ...options,
  });
};