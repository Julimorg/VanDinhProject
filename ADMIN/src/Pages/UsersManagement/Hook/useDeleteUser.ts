
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key"; 
import { IApiResponse } from "@/Interface/IApiResponse";

type UseDeleteUserOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    string 
  >,
  "mutationFn"
>;

export const useDeleteUser = (options?: UseDeleteUserOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => docApi.DeleteUser(userId),
    onSuccess: () => {
      message.success('Xóa người dùng thành công!'); 
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USERS] }); // Tự động refetch list users
    },
    onError: (error) => {
      message.error('Xóa người dùng thất bại: ' + error.message);
    },
    ...options,
  });
};