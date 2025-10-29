
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";

type UseDeleteOrderOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    string 
  >,
  "mutationFn"
>;

export const useDeleteOrder = (options?: UseDeleteOrderOptions) => {
  
  return useMutation({
    mutationFn: (orderId: string) => docApi.DeleteOrder(orderId),
    ...options,
  });
};