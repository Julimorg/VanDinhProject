import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IUsersResponse } from "@/Interface/Users/IGetUsers";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";

type UsersQueryParams = {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
};

type UseUsersOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IUsersResponse>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useUsers = (
  params: UsersQueryParams = {},
  options?: UseUsersOptions
) => {
  const { status, page = 1, size = 5, sort = "createAt,desc", search } = params;

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_USERS, { status, page, size, sort, search }],
    queryFn: () => docApi.GetAllUsers({ status, page, size, sort, search }),
    enabled: true, 
  });
};