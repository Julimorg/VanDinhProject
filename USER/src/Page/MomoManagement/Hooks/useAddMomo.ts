import { useMutation } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import type { MomoAddRequest } from '@/Interface/TMomo';


export const useAddMomo = () => {
  return useMutation({

    mutationFn: ({ id, ...body }: { id: string } & Partial<MomoAddRequest>) =>
      docApi.UpdateMomo(id, body),
  });
};
