import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { GetUserResponse } from "@/Interface/TGetUser";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type UseGetUserOption = Omit<
  UseQueryOptions<GetUserResponse, AxiosError<{ message?: string }>, GetUserResponse>,
  "queryKey" | "queryFn"
>;


export const useGetUser = (options?: UseGetUserOption) => {
  return useQuery<GetUserResponse, AxiosError<{ message?: string }>, GetUserResponse>({
    queryKey: [QueryKeys.USER],
    queryFn: () => docApi.GetUser(),
    retry: false, 
    ...options,
  });
};