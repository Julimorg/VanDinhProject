import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useUpdateDiaryStatus = (diaryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => docApi.UpdateDiaryStatus(diaryId, { diaryStatus: 'PAID' }),
    onSuccess: () => {
      message.success('Đã xác nhận thanh toán thành công!');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_DIARY_DETAIL, diaryId] });
    },
    onError: (error: any) => {
      console.error('Lỗi khi xác nhận thanh toán:', error);
      message.error(error?.message || 'Có lỗi xảy ra');
    },
  });
};