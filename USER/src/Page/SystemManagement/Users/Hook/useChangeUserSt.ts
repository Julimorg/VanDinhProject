import { docApi } from '@/Api/docApi';
import { useMutation } from '@tanstack/react-query';

export const useChangeUserStatusOptions = () => {
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      docApi.ChangeUserStatus(id, isActive),
  });
};
