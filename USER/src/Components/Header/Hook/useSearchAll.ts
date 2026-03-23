import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IApiResponsePagination } from "../../../Interface/IApiResponsePagination";
import type { IApiResponse } from "../../../Interface/IApiResponse";
import type { ISearchAllResponse } from "../../../Interface/Elasticsearch/ISearchAll";
import { elasticsearch_api } from "../../../Api/Api_Handler/elasticsearch_api";


type SearchAllQueryParams = {
  keyword?: string;
  page?: number;
  size?: number;
};

type UseSearchAllOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<ISearchAllResponse>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useSearchAll = (
  params: SearchAllQueryParams = {},
  options?: UseSearchAllOptions
) => {
  const {
    keyword,
    page = 1,
    size = 5,
  } = params;

  const cleanParams = {
    keyword,
    page,
    size,
  };

  return useQuery({
    queryKey: ["Search All", cleanParams], 
    queryFn: () => elasticsearch_api.SearchAll({
      keyword,
      page,
      size,
    }),
    enabled: true,
    ...options,
  });
};