import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { auth_api_handler } from "../../../Api/auth_api";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { message } from "antd";

type UseVerifyEmailOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    string 
  >,
  "mutationFn"
>;

export const useVerifyEmail = (options?: UseVerifyEmailOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => auth_api_handler.verifyEmail(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Verify Email'] }); 
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
    ...options,
  });
};