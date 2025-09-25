import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { ChangePass, ChangePassResponse } from '@/Interface/TChangePass';

type useChangPassOption = Omit<
  UseMutationOptions<ChangePassResponse, unknown, ChangePass>,
  'mutationFn'
>;

export const useChangePass = (options?: useChangPassOption) => {
  return useMutation<ChangePassResponse, unknown, ChangePass>({
    mutationFn: docApi.ChangePass,
    ...options,
  });
};
