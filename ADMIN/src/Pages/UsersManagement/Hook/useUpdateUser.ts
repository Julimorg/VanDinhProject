import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IUpdateUserRequest, IUpdateUserResponse } from "@/Interface/Users/IUpdateUser";


type UseUpdateUserOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateUserResponse>,
    Error,
    IUpdateUserRequest
  >,
  "mutationFn"
>;

export const useUpdateUser = (userId: string, options?: UseUpdateUserOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: IUpdateUserRequest) => docApi.UpdateUser(body, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS] });
    },
    ...options,
  });
};