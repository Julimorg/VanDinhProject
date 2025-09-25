import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import type { OrderPayload, OrderResponse } from '@/Interface/SendOder';

type UseSendOrderOptions = Omit<
  UseMutationOptions<OrderResponse, unknown, OrderPayload>,
  'mutationFn'
>;

export const useSendOrder = (options?: UseSendOrderOptions) => {
  return useMutation<OrderResponse, unknown, OrderPayload>({
    mutationFn: docApi.sendOrder,
    ...options,
  });
};
