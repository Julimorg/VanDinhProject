import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { ISendNotificationsRequest, ISendNotificationsResponse } from "@/Interface/Notification/ISendNotifications";
import { ICreatePurchaseOrderResponse, ICreatePurchaseOrderRequest } from "@/Interface/Inventory/CreatePurchaseOrder";
import { ICreatePurchaseOrderItemRequest, ICreatePurchaseOrderItemResponse } from "@/Interface/Inventory/CreatePurchaseOrderItem";
import { ICreateDiaryItemReq, ICreateDiaryItemRes } from "@/Interface/Diary/DiaryItem";

type UseCreateDiaryItemOptions = Omit<
  UseMutationOptions<
    IApiResponse<ICreateDiaryItemRes>,
    Error,
    ICreateDiaryItemReq[]  
  >,
  "mutationFn"
>;

export const useCreateDiaryItem = (diaryId?: string, options?: UseCreateDiaryItemOptions) => {
  return useMutation<
    IApiResponse<ICreateDiaryItemRes>,
    Error,
    ICreateDiaryItemReq[]  
  >({
    mutationFn: (body: ICreateDiaryItemReq[]) => {
      if (!diaryId) {
        throw new Error('Diary ID is required');
      }
      return docApi.CreateDiaryItem(diaryId, body);
    },
    ...options,
  });
};
