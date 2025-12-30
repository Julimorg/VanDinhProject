import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponsePagination } from "../../../Interface/IApiResponsePagination";
import type { IGetAllProductResponse } from "../../../Interface/Product/IGetAllProducts";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import { product_api } from "../../../Api/Api_Handler/product_api";


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
    queryKey: ["Get All Products", cleanParams], 
    queryFn: () => product_api.GetAllProducts({
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
    ...options,
  });
};