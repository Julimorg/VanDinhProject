import { useMutation } from '@tanstack/react-query';

import { docApi } from '@/Api/docApi';

export const useCreateService = () => {
  return useMutation({
    mutationFn: (data: FormData) => docApi.createService(data),
   
  });
};
