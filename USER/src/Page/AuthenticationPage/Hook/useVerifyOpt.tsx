import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { auth_api_handler } from "../../../Api/auth_api";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { message } from "antd";
import type { IVerifyOtp } from "../../../Interface/Auth/IVerifyOtp";

type UseVerifyOptOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    IVerifyOtp
  >,
  "mutationFn"
>;

export const useVerifyOpt = (options?: UseVerifyOptOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, otp }: IVerifyOtp) => auth_api_handler.verifyOtp(email, otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Verify Opt'] }); 
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
    ...options,
  });
};