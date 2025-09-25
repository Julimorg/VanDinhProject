
import { docApi } from '@/Api/docApi';
import { useMutation } from '@tanstack/react-query';


export const useUpdateService = () => {
  return useMutation({
    mutationFn: ({ service_id, data }: { service_id: string; data: FormData }) =>
      docApi.updateService(service_id, data),
  });
};