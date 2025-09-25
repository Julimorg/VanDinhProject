
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { OffShift } from '@/Interface/TShift';

type UseOffShiftOption = Omit<
  UseMutationOptions<OffShift, unknown, void>,
  'mutationFn'
>;

export const useOffShift = (options?: UseOffShiftOption) => {
  return useMutation<OffShift, unknown, void>({
    mutationFn: docApi.OffShift,
    ...options,
  });
};