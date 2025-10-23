import { docApi } from '@/Api/docApi';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetCategoryDetailResponse } from '@/Interface/Category/IGetCategoryDetail';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type UseGetCategoryDetailOptions = Omit<
UseQueryOptions<IApiResponse<IGetCategoryDetailResponse>, unknown, IApiResponse<IGetCategoryDetailResponse>, [string, string | undefined]>,
    'queryKey' | 'queryFn'
>;

export const useGetCategoryDetail = (categoryId?: string, options?: UseGetCategoryDetailOptions) => {
    return useQuery<IApiResponse<IGetCategoryDetailResponse>, unknown, IApiResponse<IGetCategoryDetailResponse>, [string, string | undefined]>({
        queryKey: ['categoryDetail', categoryId],
        queryFn: () => docApi.GetCategoryDetail(categoryId!),
        enabled: !!categoryId,
        ...options,
    });
}
