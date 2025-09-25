import { useMutation } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
// import { QueryKeys } from '@/Constant/query-key';
import type { MomoUpdateRequest } from '@/Interface/TMomo';

export const useUpdateMomo = () => {
//   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<MomoUpdateRequest>) =>
      docApi.UpdateMomo(id, body),

    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_MOMO] });
    // },
  });
};
