import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import type { MomoResponse, oderMomo } from '@/Interface/TMomo';

type useMomoOrder = Omit<
  UseMutationOptions<MomoResponse, unknown, oderMomo>,
  'mutationFn'
>;

export const useMomoOrder = (options?: useMomoOrder) => {
  return useMutation<MomoResponse, unknown, oderMomo>({
    mutationFn: docApi.momoPay,
    ...options,
  });
};
