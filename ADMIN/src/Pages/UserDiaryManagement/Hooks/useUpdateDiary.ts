import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IUpdateDiaryReq } from "@/Interface/Diary/UpdateDiary";
import { IUpdatePurchaseOrder } from "@/Interface/Inventory/UpdatePurchaseOrder";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { message } from "antd";

export const useUpdateDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      diaryId,
      payload,
    }: {
      userId: string,
      diaryId: string;
      payload: IUpdateDiaryReq;
    }) => {
      return await docApi.UpdateDiary(userId, diaryId, payload);
    },
    onSuccess: (_) => {
      message.success('Cập nhật phiếu nhật kí thành công!');
     queryClient.invalidateQueries({queryKey: [QueryKeys.GET_ALL_DIARY]});
    },
    onError: (error: any) => {
      console.error('Lỗi khi cập nhật:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi cập nhật phiếu');
    },
  });
};