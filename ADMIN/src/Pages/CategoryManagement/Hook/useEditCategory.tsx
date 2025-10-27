import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
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
    return useMutation({
        mutationFn: (body: IUpdateCategoryRequest) => docApi.UpdateCategory(body, categoryId),
        ...options,
    })
}