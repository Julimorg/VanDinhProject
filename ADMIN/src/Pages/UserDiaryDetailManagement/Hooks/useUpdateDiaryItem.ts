import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IUpdateDiaryItemReq } from "@/Interface/Diary/UpdateDiaryItem";
import { IUpdatePurchaseOrder } from "@/Interface/Inventory/UpdatePurchaseOrder";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { toast } from "react-toastify";

export const useUpdateDiaryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      diaryId,
      itemId,
      body
    }: {
      diaryId: string;
        itemId: string;
      body: IUpdateDiaryItemReq;
    }) => {
      return await docApi.UpdateDiaryItem(diaryId, itemId, body);
    },
    onSuccess: (_, variables) => {
      toast.success('Cập nhật sản phẩm thành công!');
       queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_DIARY_DETAIL, variables.diaryId] });
    },
    onError: (error: any) => {
      console.error('Lỗi khi cập nhật:', error);
      toast.error(error?.message || 'Có lỗi xảy ra khi cập nhật phiếu');
    },
  });
};