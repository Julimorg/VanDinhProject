import { ICreateCategoryRequest, ICreateCategoryResponse } from "@/Interface/Category/ICreateCategory";
import { IApiResponse } from "@/Interface/IApiResponse";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
type useCreateCategoryOptions = Omit<
    UseMutationOptions<IApiResponse<ICreateCategoryResponse>, Error, ICreateCategoryRequest>,
    "mutationFn"
>;

export const useCreateCategory = (options?: useCreateCategoryOptions) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: ICreateCategoryRequest) => docApi.CreateCategory(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_CATEGORY] });
        },
        ...options
    });
}