import { useInfiniteQuery } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/constants/query-key";

type ProductsQueryParams = {
  keyword?: string;
  categoryName?: string;
  supplierName?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: number;
  sort?: string;
};

export const useGetAllProducts = (params: ProductsQueryParams = {}) => {
  const {
    keyword,
    categoryName,
    supplierName,
    minPrice,
    maxPrice,
    size = 5,
    sort = "createAt,desc",
  } = params;

  //? Clean params - chỉ giữ những giá trị có thực
  const cleanParams = {
    ...(keyword && { keyword }),
    ...(categoryName && { categoryName }),
    ...(supplierName && { supplierName }),
    ...(minPrice !== undefined && minPrice !== null && { minPrice }),
    ...(maxPrice !== undefined && maxPrice !== null && { maxPrice }),
    size,
    sort,
  };

  console.log(" Clean Params:", cleanParams);

  return useInfiniteQuery({
    queryKey: [QueryKeys.GET_ALL_PRODUCT, cleanParams],
    queryFn: ({ pageParam = 0 }) => {
      console.log(`📄 Fetching page ${pageParam} with params:`, cleanParams);
      return docApi.GetAllProducts({
        ...cleanParams,
        page: pageParam, 
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {

      const pagination = lastPage?.data?.page;
      
      if (!pagination) {
        console.log("No pagination info found");
        return undefined;
      }

      const currentPage = pagination.number;
      const totalPages = pagination.totalPages;

      console.log(`Pagination: page ${currentPage + 1}/${totalPages}`);

      if (currentPage + 1 < totalPages) {
        console.log(`Has next page: ${currentPage + 1}`);
        return currentPage + 1;
      }
      
      console.log("No more pages");
      return undefined;
    },
  });
};