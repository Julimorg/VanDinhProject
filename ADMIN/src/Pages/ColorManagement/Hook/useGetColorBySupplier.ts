import axiosClient from '@/Api/axiosClient';
import { QueryKeys } from '@/Constant/query-key';
import { useQuery } from '@tanstack/react-query';

export interface ColorItem {
  colorId: string;
  colorName: string;
  colorCode: string;
  colorHex: string;
  albumId: string | null;
  albumName: string | null;
}

export const useGetColorsBySupplier = (supplierId?: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_COLORS, supplierId],
    queryFn: async () => {
      // Lấy toàn bộ màu của supplier (không phân trang) để group theo album ở client
      const res = await axiosClient.get('/api/v1/colors', {
        params: { supplierId, size: 1000 },
      });
      // TODO: chỉnh lại nếu response là dạng { data: { content: [...] } }
      return (res.data?.data?.content ?? res.data?.data ?? []) as ColorItem[];
    },
    enabled: !!supplierId,
  });
};