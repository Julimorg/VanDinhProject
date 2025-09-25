// useUpdateAdminProfile.ts
import { docApi } from "@/Api/docApi";
import type { EditUserRequest } from "@/Interface/TEditUser";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type useUpdateOptions = Omit<
  UseMutationOptions<unknown, AxiosError<{ message?: string }>, EditUserRequest>,
  "mutationFn"
>;

export const useUpdateAdminProfile = (user_id: string, option?: useUpdateOptions) => {
  return useMutation<unknown, AxiosError<{ message?: string }>, EditUserRequest>({
    mutationFn: (body: EditUserRequest) => docApi.UpdateAdmin(body, user_id),
    ...option,
  });
};