import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { toast } from 'react-toastify';

export const useDeleteDiaryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ diaryId, itemId }: { diaryId: string; itemId: string }) => {
      return await docApi.DeleteDiaryItem(diaryId, itemId);
    },
    onSuccess: (_, variables) => {
      toast.success('Xoá phiếu sản phẩm công!');
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_DIARY_DETAIL, variables.diaryId] });
    },
    onError: (error: any) => {
      console.error('Lỗi khi xoá phiếu:', error);
      toast.error(error?.message || 'Có lỗi xảy ra khi xoá phiếu');
    },
  });
};