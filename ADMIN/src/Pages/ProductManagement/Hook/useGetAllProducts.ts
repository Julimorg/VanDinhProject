import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { QueryKeys } from "@/Constant/query-key";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetAllProductResponse } from "@/Interface/Product/IGetAllProducts";
import { docApi } from "@/Api/docApi";

type ProductsQueryParams = {
  keyword?: string;
  categoryName?: string;
  supplierName?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
};

type UseProductsOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IGetAllProductResponse>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetAllProducts = (
  params: ProductsQueryParams = {},
  options?: UseProductsOptions
) => {
  const {
    keyword,
    categoryName,
    supplierName,
    minPrice,
    maxPrice,
    page = 1,
    size = 5,
    sort = "createAt,desc", 
  } = params;

  const cleanParams = {
    keyword,
    categoryName,
    supplierName,
    minPrice: minPrice !== undefined ? minPrice : undefined,
    maxPrice: maxPrice !== undefined ? maxPrice : undefined,
    page,
    size,
    sort,
  };

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_ALL_PRODUCT, cleanParams], 
    queryFn: () => docApi.GetAllProducts({
      keyword,
      categoryName,
      supplierName,
      minPrice,
      maxPrice,
      page,
      size,
      sort,
    }),
    enabled: true,

  });
};