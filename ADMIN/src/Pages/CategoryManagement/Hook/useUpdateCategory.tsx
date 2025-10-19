import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IUpdateCategoryRequest, IUpdateCategoryResponse } from "@/Interface/Category/IUpdateCategory";

type UseUpdateCategoryOptions = Omit<
  UseMutationOptions<
    IApiResponse<IUpdateCategoryResponse>,
    Error,
    IUpdateCategoryRequest
  >,
  "mutationFn"
>;

export const useUpdateCategory = (categoryId: string, options?: UseUpdateCategoryOptions) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: IUpdateCategoryRequest) => docApi.UpdateCategory(body, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_CATEGORY] });
        }
    })
}