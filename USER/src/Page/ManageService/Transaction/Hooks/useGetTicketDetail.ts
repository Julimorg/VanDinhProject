import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import type { TransactionDetailResponse } from '@/Interface/TTransactionDetail';

type UseGetTicketDetailOptions = Omit<
  UseQueryOptions<TransactionDetailResponse, unknown, TransactionDetailResponse, [string, string | undefined]>,
  'queryKey' | 'queryFn'
>;

export const useGetTicketDetail = (cart_id?: string, options?: UseGetTicketDetailOptions) => {
  return useQuery<TransactionDetailResponse, unknown, TransactionDetailResponse, [string, string | undefined]>({
    queryKey: ['ticketDetail', cart_id],
    queryFn: async () => {
      const response = await docApi.GetDetailTicket(cart_id);
      // console.log('API response:', response); 
      return Array.isArray(response) ? response[0] : response;
    },
    enabled: !!cart_id,
    retry: false,
    ...options,
  });
};