import { useMutation, useQueryClient } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { message } from 'antd';

interface UseMarkAllNotificationsAsReadOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useMarkAllNotificationsAsRead = (options?: UseMarkAllNotificationsAsReadOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await docApi.MarkAllNotificationsAsRead(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_NOTIFICATIONS] });
      message.success('Đã đánh dấu tất cả thông báo là đã đọc');
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Lỗi khi đánh dấu tất cả thông báo:', error);
      message.error('Có lỗi xảy ra khi đánh dấu thông báo');
      options?.onError?.(error);
    },
  });
};

