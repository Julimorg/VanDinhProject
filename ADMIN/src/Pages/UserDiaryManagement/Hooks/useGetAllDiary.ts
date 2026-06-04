import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { IGetDiaryResponse } from "@/Interface/Diary/GetDiary";
import { IApiResponse } from "@/Interface/IApiResponse";
import { IApiResponsePagination } from "@/Interface/IApiResponsePagination";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type DiaryParams = {
  keyword?: string;
  status?: string;
  fromtDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sort?: string;
};

type DiaryOptions = Omit<
  UseQueryOptions<IApiResponse<IApiResponsePagination<IGetDiaryResponse>>, unknown>,
  "queryKey" | "queryFn"
>;

export const useGetAllDiary = (
  userId: string,
  params: DiaryParams = {},
  options?: DiaryOptions
) => {
  const {
    keyword,
    status,
    fromtDate,
    toDate,
    page = 0,
    size = 5,
    sort = "createdAt,desc",
  } = params;

  const cleanParams = {
    keyword, status, fromtDate, toDate, page, size, sort,
  };

  return useQuery({
    queryKey: [QueryKeys.GET_ALL_DIARY, userId, cleanParams],
    queryFn:  () => docApi.GetAllDiary(userId, { keyword, status, fromtDate, toDate, page, size, sort }),
    enabled:  !!userId,
    ...options,  
  });
};