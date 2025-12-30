
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { IApiResponsePagination } from "../../../Interface/IApiResponsePagination";
import type { IGetAllSupplierResponse } from "../../../Interface/Supplier/IGetAllSuppliers";
import { QueryKeys } from "../../../Constant/query-key";
import { supplier_api } from "../../../Api/Api_Handler/supplier_api";
import type { SupplierQueryParams } from "../../../Constant/query-param";

type UseSupplierOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IGetAllSupplierResponse>>, unknown>,
  "queryKey" | "queryFn"
>;


export const useGetAllSupplier = (
  params: SupplierQueryParams = {},
  options?: UseSupplierOptions
) => {
  const { keyword, page = 0, size = 5, sort = "createAt,desc" } = params; 

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_SUPPLIER, { keyword, page, size, sort }], 
    queryFn: () => supplier_api.GetAllSupplier({ keyword, page, size, sort }),
    enabled: true, 
  })};