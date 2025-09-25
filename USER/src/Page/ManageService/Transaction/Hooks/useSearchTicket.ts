

import { docApi } from '@/Api/docApi';
import type { ReqSearchTicket, SearchResponse } from '@/Interface/TSearchTicket';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

type UseSearchTicketOption = Omit<
  UseMutationOptions<SearchResponse, unknown, ReqSearchTicket>,
  'mutationFn'
>;

export const useSearchTicket = (options?: UseSearchTicketOption) => {
  return useMutation<SearchResponse, unknown, ReqSearchTicket>({
    mutationFn: (variables: ReqSearchTicket) =>
      docApi.SearchTicket(variables.customer_email, variables.customer_phone_number),
    ...options,
  });
};