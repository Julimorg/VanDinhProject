
import { docApi } from "@/Api/docApi";
import { IUpdateColorRequest, IUpdateColorResponse } from "@/Interface/Color/IUpdateColor";
import { IApiResponse } from "@/Interface/IApiResponse";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";


type UseUpdateColorOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateColorResponse>,
    Error,
    IUpdateColorRequest
  >,
  "mutationFn"
>;

export const useUpdateColor = (colorId: string, options?: UseUpdateColorOptions) => {
  
  return useMutation({
    mutationFn: (body: IUpdateColorRequest) => docApi.UpdateColor(colorId, body),
    ...options,
  });
};