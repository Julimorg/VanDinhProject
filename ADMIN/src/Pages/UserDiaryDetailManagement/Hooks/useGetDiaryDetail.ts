import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { IGetDiaryDetailRes } from '@/Interface/Diary/GetDiaryDetail';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IGetPurchaseOrderDetailResponse } from '@/Interface/Inventory/GetPurchaseOrderDetail';
import { IGetOrderDetailResponse } from '@/Interface/Order/IGetOrderDetail';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type GetDiaryDetailOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetDiaryDetailRes>, 
    unknown, 
    IApiResponse<IGetDiaryDetailRes>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;
    
export const useGetDiaryDetail = (diaryId?: string, options?: GetDiaryDetailOptions) => {
  return useQuery<IApiResponse<IGetDiaryDetailRes>, unknown, IApiResponse<IGetDiaryDetailRes>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_DIARY_DETAIL, diaryId],
    queryFn: () => docApi.GetDiaryDetail(diaryId!),
    enabled: !!diaryId,
    ...options,     
  });
};