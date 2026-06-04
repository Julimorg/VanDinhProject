import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useDeleteDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, diaryId }: { userId: string; diaryId: string }) => {
      return await docApi.DeleteDiary(userId, diaryId);
    },
    onSuccess: () => {
      message.success('Xoá phiếu nhập kho thành công!');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_DIARY]});
    },
    onError: (error: any) => {
      console.error('Lỗi khi xoá phiếu:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi xoá phiếu');
    },
  });
};