import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { ISendNotificationsRequest, ISendNotificationsResponse } from "@/Interface/Notification/ISendNotifications";
import { ICreatePurchaseOrderResponse, ICreatePurchaseOrderRequest } from "@/Interface/Inventory/CreatePurchaseOrder";
import { ICreatePurchaseOrderItemRequest, ICreatePurchaseOrderItemResponse } from "@/Interface/Inventory/CreatePurchaseOrderItem";

type UseCreatePurchaseOrderItemsOptions = Omit<
  UseMutationOptions<
    IApiResponse<ICreatePurchaseOrderItemResponse>,
    Error,
    ICreatePurchaseOrderItemRequest[]  
  >,
  "mutationFn"
>;

export const useCreatePurchaseOrderItems = (purchaseOrderId?: string, options?: UseCreatePurchaseOrderItemsOptions) => {
  return useMutation<
    IApiResponse<ICreatePurchaseOrderItemResponse>,
    Error,
    ICreatePurchaseOrderItemRequest[]  
  >({
    mutationFn: (body: ICreatePurchaseOrderItemRequest[]) => {
      if (!purchaseOrderId) {
        throw new Error('Purchase order ID is required');
      }
      return docApi.CreatePurchaseOrderItem(purchaseOrderId, body);
    },
    ...options,
  });
};
