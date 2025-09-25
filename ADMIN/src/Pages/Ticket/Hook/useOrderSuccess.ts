// hooks/useOrderSuccess.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { OrderSuccessResponse } from '@/Interface/TCash';


type OrderSuccessPayload = {
  cart_id: string;
  method: 'cash' ;
};

type UseOrderSuccessOptions = Omit<
  UseMutationOptions<OrderSuccessResponse, unknown, OrderSuccessPayload>,
  'mutationFn'
>;

export const useOrderSuccess = (options?: UseOrderSuccessOptions) => {
  return useMutation<OrderSuccessResponse, unknown, OrderSuccessPayload>({
    mutationFn: ({ cart_id, method }) => docApi.OrderSuccess(cart_id, method),
    ...options,
  });
};
