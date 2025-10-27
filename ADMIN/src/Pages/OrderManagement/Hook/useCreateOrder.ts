import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { ICreateOrderRequest, ICreateOrderResponse } from "@/Interface/Order/ICreateOrder";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";


type UseCreateOrderOptions = Omit<
  UseMutationOptions<
    IApiResponse<ICreateOrderResponse>,
    Error,
    { userId: string; body: ICreateOrderRequest }
  >,
  "mutationFn"
>;

export const useCreateOrder = (options?: UseCreateOrderOptions) => {
  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: ICreateOrderRequest }) =>
      docApi.CreateOrder(userId, body),
    ...options,
  });
};