import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { ISendNotificationsRequest, ISendNotificationsResponse } from "@/Interface/Notification/ISendNotifications";
import { ICreatePurchaseOrderResponse, ICreatePurchaseOrderRequest } from "@/Interface/Inventory/CreatePurchaseOrder";

type UseCreatePurchaseOrderOptions = Omit<
  UseMutationOptions<
    IApiResponse<ICreatePurchaseOrderResponse>,
    Error,
    ICreatePurchaseOrderRequest
  >,
  "mutationFn"
>;

export const useCreatePurchaseOrder = (options?: UseCreatePurchaseOrderOptions) => {
  return useMutation({
    mutationFn: (body: ICreatePurchaseOrderRequest) => docApi.CreatePurchaseOrder(body),
    ...options,
  });
};
