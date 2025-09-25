import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { TicketDetailResponse } from '@/Interface/TTicketDetail';

type UseGetTicketDetailOptions = Omit<
  UseQueryOptions<TicketDetailResponse, unknown, TicketDetailResponse, [string, string | undefined]>,
  'queryKey' | 'queryFn'
>;

export const useGetTicketDetail = (cart_id?: string, options?: UseGetTicketDetailOptions) => {
  return useQuery<TicketDetailResponse, unknown, TicketDetailResponse, [string, string | undefined]>({
    queryKey: ['ticketDetail', cart_id],
    queryFn: () => docApi.GetDetailTicket(cart_id),
    enabled: !!cart_id,
    ...options,
  });
};