
import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { ICreateDiaryRequest } from '@/Interface/Diary/CreateDiary';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useCreateDiary = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICreateDiaryRequest) => {
      return await docApi.CreateDiary(userId, payload);
    },
    onSuccess: () => {
      message.success('Tạo nhật ký mới thành công!');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_DIARY, userId] });
    },
    onError: (error: any) => {
      console.error('Lỗi khi tạo nhật ký:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi tạo nhật ký');
    },
  });
};