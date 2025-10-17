
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IGetAllSupplierResponse } from "@/Interface/Supplier/IGetAllSuppliers";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type SupplierQueryParams = {
    keyword?: string;
    page?: number;
    size?: number;
    sort?: string;
}

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
    queryFn: () => docApi.GetAllSupplier({ keyword, page, size, sort }),
    enabled: true, 
  })};