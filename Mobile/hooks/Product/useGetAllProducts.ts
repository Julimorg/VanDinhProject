import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IGetAllProductResponse } from "@/Interface/Product/IGetAllProducts";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/constants/query-key";

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
  // Trong useGetAllProducts.ts
  console.log("🔍 Params gửi API:", cleanParams);
  console.log("🔗 URL đầy đủ:", `/public/get-products?${new URLSearchParams({
    page: cleanParams.page.toString(),
    size: cleanParams.size.toString(),
    sort: cleanParams.sort,
    ...(cleanParams.keyword && { keyword: cleanParams.keyword }),
    ...(cleanParams.categoryName && { categoryName: cleanParams.categoryName }),
    ...(cleanParams.supplierName && { supplierName: cleanParams.supplierName }),
    ...(cleanParams.minPrice != null && { minPrice: cleanParams.minPrice.toString() }),
    ...(cleanParams.maxPrice != null && { maxPrice: cleanParams.maxPrice.toString() }),
  }).toString()}`);
  
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
