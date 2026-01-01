
import { useInfiniteQuery } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 10;

interface UseSuppliersInfiniteParams {
  keyword?: string;
}

export const useSuppliersInfinite = ({ keyword }: UseSuppliersInfiniteParams = {}) => {
  const debouncedKeyword = useDebounce(keyword || '', 500);

  return useInfiniteQuery({
    queryKey: ['suppliers', debouncedKeyword],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await docApi.GetAllSupplier({
        keyword: debouncedKeyword || undefined,
        page: pageParam,
        size: PAGE_SIZE,
        sort: 'createAt,desc',
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.page;
      return pageInfo.number + 1 < pageInfo.totalPages
        ? pageInfo.number + 1
        : undefined;
    },
  });
};