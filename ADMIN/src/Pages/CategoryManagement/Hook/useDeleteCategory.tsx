import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { message } from "antd";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key"; 
import { IApiResponse } from "@/Interface/IApiResponse";

type UseDeleteCategoryOptions = Omit<
  UseMutationOptions<
    IApiResponse<void>,
    Error,
    string 
  >,
  "mutationFn"
>;

export const useDeleteCategory = (options?: UseDeleteCategoryOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => docApi.DeleteCategory(categoryId),
    onSuccess: () => {
      message.success('Xóa danh mục thành công!'); 
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_CATEGORY] });
    },
    onError: (error) => {
      message.error('Xóa danh mục thất bại: ' + error.message);
    },
    ...options,
  });
};