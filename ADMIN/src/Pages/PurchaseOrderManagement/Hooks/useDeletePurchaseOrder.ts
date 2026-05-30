import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseOrderId: string) => {
      return await docApi.DeletePurchaseOrder(purchaseOrderId);
    },
    onSuccess: () => {
      message.success('Xoá phiếu nhập kho thành công!');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_PURCHASE_ORDERS]});
    },
    onError: (error: any) => {
      console.error('Lỗi khi xoá phiếu:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi xoá phiếu');
    },
  });
};