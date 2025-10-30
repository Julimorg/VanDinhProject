import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IApproveOrderStatusRequest, IApproveOrderStatusResponse } from "@/Interface/Order/IApproveOrderStatus";

type UseApproveOrderStatusOptions = Omit<
  UseMutationOptions<
    IApiResponse<IApproveOrderStatusResponse>,
    Error,
    IApproveOrderStatusRequest
  >,
  "mutationFn"
>;

export const useApproveOrderStatus = (userId: string, orderId: string, options?: UseApproveOrderStatusOptions) => {
    return useMutation({
        mutationFn: (body: IApproveOrderStatusRequest) => docApi.ApproveOrder(userId, orderId, body),
        ...options,
    })
}