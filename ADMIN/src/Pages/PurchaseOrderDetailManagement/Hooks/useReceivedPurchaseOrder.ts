import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useReceivePurchaseOrder = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await docApi.UpdatePurchaseOrderStatus(id, { status: 'RECEIVED' });
    },
    onSuccess: (_, id) => {
      message.success('Đã xác nhận nhận hàng thành công!');
      queryClient.invalidateQueries({queryKey: [QueryKeys.GET_PURCHASE_DETAIL, id], }); 
    },
    onError: (error: any) => {
      console.error('Lỗi khi xác nhận nhận hàng:', error);
      message.error(error?.message || 'Có lỗi xảy ra');
    },
  });
};