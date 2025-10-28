
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";

type UseDeleteDeleteOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    string 
  >,
  "mutationFn"
>;

export const useDeleteColor = (options?: UseDeleteDeleteOptions) => {
  
  return useMutation({
    mutationFn: (colorId: string) => docApi.DeleteColor(colorId),
    ...options,
  });
};