import axiosClient from '@/Api/axiosClient';
import { QueryKeys } from '@/Constant/query-key';
import { useQuery } from '@tanstack/react-query';

export interface AlbumItem {
  albumId: string;
  albumName: string;
  albumImg?: string;
}

export const useGetAlbumsBySupplier = (supplierId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_ALBUM, supplierId],
    queryFn: async () => {
      const res = await axiosClient.get('/api/v1/albums', {
        params: { supplierId },
      });
      return (res.data?.data ?? []) as AlbumItem[];
    },
    enabled: !!supplierId,
  });
};