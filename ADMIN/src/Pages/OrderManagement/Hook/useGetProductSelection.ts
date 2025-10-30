import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetProductSelectionResponse } from "@/Interface/Product/IGetProductSelection";
import { docApi } from "@/Api/docApi";

type ProductSelectionQueryParams = {
  keyword?: string;
  categoryName?: string;
  supplierName?: string;
  minPrice?: number;
  maxPrice?: number;
};

type UseGetProductSelectionOptions = Omit<
  UseQueryOptions<IApiResponse<IGetProductSelectionResponse>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetProductSelections = (
  params: ProductSelectionQueryParams = {},
  options?: UseGetProductSelectionOptions
) => {
  const {
    keyword,
    categoryName,
    supplierName,
    minPrice,
    maxPrice,
  } = params;

  const cleanParams = {
    keyword,
    categoryName,
    supplierName,
    minPrice: minPrice !== undefined ? minPrice : undefined,
    maxPrice: maxPrice !== undefined ? maxPrice : undefined,
  };

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_PRODUCT_SELECTION, cleanParams],
    queryFn: () => docApi.GetProductSelection({
      keyword,
      categoryName,
      supplierName,
      minPrice,
      maxPrice,
    }),
    enabled: true,

  });
};