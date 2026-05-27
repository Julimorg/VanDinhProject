import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetAllProductResponse } from "@/Interface/Product/IGetAllProducts";
import { docApi } from "@/Api/docApi";
import { IGetPurchaseOrderResponse } from "@/Interface/Inventory/GetPurchaseOrder";

type PurchaseOrderParams = {
    keyword?: string,
    status?: string,
    orderDateFrom?: string,
    orderDateTo?: string,
    page?: number,
    size?: number,
    sort?: string,
};

type PurchaseOrderOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IGetPurchaseOrderResponse>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetAllPurchaseOrders = (
  params: PurchaseOrderParams = {},
  options?: PurchaseOrderOptions
) => {
  const {
    keyword,
    status,
    orderDateFrom,
    orderDateTo,
    page = 0,
    size = 10,
    sort = "createAt,desc", 
  } = params;

  const cleanParams = {
    keyword,
    status,
    orderDateFrom,
    orderDateTo,
    page,
    size,
    sort,
  };

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_PURCHASE_ORDERS, cleanParams], 
    queryFn: () => docApi.GetPurchaseOrder({
      keyword,
      status,
      orderDateFrom,
      orderDateTo,
      page,
      size,
      sort,
    }),
    enabled: true,

  });
};