import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { ILogOutRequest } from "../../../Interface/Auth/ILogOut";
import { auth_api_handler } from "../../../Api/auth_api";


type UseLogOutOptions = Omit<
  UseMutationOptions<IApiResponse<void>, unknown, ILogOutRequest>,
  'mutationFn'
>;

export const useLogOut = (options?: UseLogOutOptions) => {
  return useMutation<IApiResponse<void>, unknown, ILogOutRequest>({
    mutationFn: auth_api_handler.LogOut, 
    ...options,
  });
};