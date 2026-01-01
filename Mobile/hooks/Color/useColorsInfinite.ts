// hooks/Color/useColorsInfinite.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 12;

interface UseColorsInfiniteParams {
  keyword?: string;
  supplierName?: string;
}

export const useColorsInfinite = ({
  keyword,
  supplierName,
}: UseColorsInfiniteParams = {}) => {
  const debouncedKeyword = useDebounce(keyword || '', 500);

  const enabled = !!debouncedKeyword || !!supplierName;

  console.log('🔍 [useColorsInfinite] Params:', {
    keyword,
    debouncedKeyword,
    supplierName,
    enabled,
  });

  return useInfiniteQuery({
    queryKey: ['colors', debouncedKeyword, supplierName],
    queryFn: async ({ pageParam = 0 }) => {
      const params = {
        keyword: debouncedKeyword || undefined,
        supplierName: supplierName || undefined,
        page: pageParam,
        size: PAGE_SIZE,
        sort: 'createAt,desc',
      };

      console.log('🚀 [queryFn] Gọi API với params:', params);

      const response = await docApi.GetAllColor(params);

      console.log('📥 [queryFn] Response nhận về:', {
        status_code: response.status_code,
        message: response.message,
        hasData: !!response.data,
        contentLength: Array.isArray(response.data?.content) ? response.data.content.length : 0,
        pageInfo: response.data?.page,
      });

      return response.data; // IApiResponsePagination<IGetAllColor>
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.page;
      console.log('📄 [getNextPageParam] Page info:', pageInfo);
      return pageInfo.number + 1 < pageInfo.totalPages
        ? pageInfo.number + 1
        : undefined;
    },
    enabled,
  });
};