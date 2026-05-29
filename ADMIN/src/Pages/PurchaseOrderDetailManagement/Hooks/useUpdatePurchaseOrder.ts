import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IUpdatePurchaseOrder } from "@/Interface/Inventory/UpdatePurchaseOrder";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { message } from "antd";

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdatePurchaseOrder;
    }) => {
      return await docApi.UpdatePurchaseOrder(id, payload);
    },
    onSuccess: (_, variables) => {
      message.success('Cập nhật phiếu nhập kho thành công!');
     queryClient.invalidateQueries({queryKey: [QueryKeys.GET_PURCHASE_DETAIL, variables.id], });
    },
    onError: (error: any) => {
      console.error('Lỗi khi cập nhật:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi cập nhật phiếu');
    },
  });
};