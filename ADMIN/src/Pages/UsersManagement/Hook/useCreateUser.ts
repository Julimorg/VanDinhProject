import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponse } from "@/Interface/IApiResponse";
import { ICreateUserRequest, ICreateUserResponse } from "@/Interface/Users/ICreateUser";

type UseCreateUserOptions = Omit<
  UseMutationOptions<
    IApiResponse<ICreateUserResponse>,
    Error,
    ICreateUserRequest
  >,
  "mutationFn"
>;

export const useCreateUser = (options?: UseCreateUserOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ICreateUserRequest) => docApi.CreateUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS] });
    },
    ...options,
  });
};