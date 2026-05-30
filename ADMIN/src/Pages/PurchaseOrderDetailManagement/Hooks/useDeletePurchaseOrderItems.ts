import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useDeletePurchaseOrderItem = (itemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      return await docApi.DeletePurchaseOrderItem(itemId);
    },
    onSuccess: (_, itemId) => {
      message.success('Xoá sản phẩm thành công!');
      queryClient.invalidateQueries({queryKey: [QueryKeys.GET_PURCHASE_DETAIL, itemId], }); 
    },
    onError: (error: any) => {
      console.error('Lỗi khi xoá sản phẩm:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi xoá sản phẩm');
    },
  });
};