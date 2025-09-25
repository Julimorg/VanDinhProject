import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { OnShift } from '@/Interface/TShift';


type UseOnShiftOption = Omit<
  UseMutationOptions<OnShift, unknown, void>,
  'mutationFn'
>;

export const useOnShift = (options?: UseOnShiftOption) => {
  return useMutation<OnShift, unknown, void>({
    mutationFn: docApi.OnShift,
    ...options,
  });
};
