import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "../../../Api/docApi";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { QueryKeys } from "@/Constant/query-key";
import type { IRegisterRequest } from "../../../Interface/Auth/IRegister";
import type { IRegisterResponse } from "../../../Interface/Auth/IRegister";

type UseRegisterOptions = Omit<
  UseMutationOptions<
    IApiResponse<IRegisterResponse>,
    Error,
    IRegisterRequest
  >,
  "mutationFn"
>;

export const useRegister = (options?: UseRegisterOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: IRegisterRequest) => docApi.register(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS] });
    },
    onError: () => {
      console.log("Create user error");
    },
    ...options,
  });
};