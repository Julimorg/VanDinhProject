import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { IApiResponse } from '@/Interface/IApiResponse';
import { ILogOutRequest } from '@/Interface/Auth/ILogOut';

type UseLogOutOptions = Omit<
  UseMutationOptions<IApiResponse<void>, unknown, ILogOutRequest>,
  'mutationFn'
>;

export const useLogOut = (options?: UseLogOutOptions) => {
  return useMutation<IApiResponse<void>, unknown, ILogOutRequest>({
    mutationFn: docApi.LogOut, 
    ...options,
  });
};