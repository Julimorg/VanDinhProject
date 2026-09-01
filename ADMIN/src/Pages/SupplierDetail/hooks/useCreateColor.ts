
import { docApi } from "@/Api/docApi";
import { ICreateColorRequest, ICreateColorResponse } from "@/Interface/Color/ICreateColor";
import { IApiResponse } from "@/Interface/IApiResponse";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";


type UseCreateColorOptions = Omit<
  UseMutationOptions<
    IApiResponse<ICreateColorResponse>,
    Error,
    ICreateColorRequest
  >,
  "mutationFn"
>;

export const useCreateColor = (options?: UseCreateColorOptions) => {


  return useMutation({
    mutationFn: (body: ICreateColorRequest) => docApi.CreateColor(body),
    ...options,
  });
};