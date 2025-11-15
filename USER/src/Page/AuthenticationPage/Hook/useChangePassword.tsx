import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "../../../Api/docApi";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { message } from "antd";
import type { IChangePassword } from "../../../Interface/Auth/IChangePassword";

type UseChangePasswordOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    IChangePassword
  >,
  "mutationFn"
>;

export const useChangePassword = (options?: UseChangePasswordOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password, newPassword }: IChangePassword) =>docApi.changePassword(email, { password, newPassword }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Change Password'] }); 
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
    ...options,
  });
};