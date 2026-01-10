import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IUsersResponse } from "@/Interface/Users/IGetUsers";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { IApiResponse } from "@/Interface/IApiResponse";

type UsersQueryParams = {
  status?: string;
  role?: string;
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
};

type UseUsersOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IUsersResponse>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useUsers = (
  params: UsersQueryParams = {},
  options?: UseUsersOptions
) => {
  const { status, role, page = 0, size = 5, sort = "createAt,desc", keyword } = params;

  return useQuery({
    ...options,
    queryKey: [QueryKeys.GET_USERS, { status, role, page, size, sort, keyword }],
    queryFn: () => docApi.GetAllUsers({ status, role, page, size, sort, keyword }),
    enabled: true, 
  });
};