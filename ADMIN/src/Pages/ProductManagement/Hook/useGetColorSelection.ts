import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { IGetColorSelectionResponse } from '@/Interface/Color/IGetColorSelection';
import { IApiResponse } from '@/Interface/IApiResponse';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type UseGetColorSelectOptions = Omit<
  UseQueryOptions<
    IApiResponse<IGetColorSelectionResponse>, 
    unknown, 
    IApiResponse<IGetColorSelectionResponse>, 
    [string, string | undefined]
  >,
  'queryKey' | 'queryFn'
>;

export const useGetColorSelection = (supplierId?: string, options?: UseGetColorSelectOptions) => {
  return useQuery<IApiResponse<IGetColorSelectionResponse>, unknown, IApiResponse<IGetColorSelectionResponse>, [string, string | undefined]>({
    queryKey: [QueryKeys.GET_COLOR_SELECTION, supplierId], 
    queryFn: () => docApi.GetColorSelection(supplierId!),
    enabled: !!supplierId, 
    ...options, 
  });
};