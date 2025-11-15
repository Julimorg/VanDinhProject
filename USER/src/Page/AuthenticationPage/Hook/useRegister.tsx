import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { auth_api_handler } from "../../../Api/auth_api";
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
    mutationFn: (body: IRegisterRequest) => auth_api_handler.register(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Register'] });
    },
    onError: () => {
      console.log("Create user error");
    },
    ...options,
  });
};