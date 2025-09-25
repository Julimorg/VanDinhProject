import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { ReceipterStatisticDetailResponse } from "@/Interface/TRevenue";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type UseGetReceiperStatisticDetailOptions = Omit<UseQueryOptions<ReceipterStatisticDetailResponse,AxiosError<{message?: string}>>, "queryKey" | "queryFn">;


export const useGetReceipterStatisticDetail = (user_id: string, start_date:string, end_date: string, options?:UseGetReceiperStatisticDetailOptions) => {
    return useQuery<ReceipterStatisticDetailResponse, AxiosError<{message?: string}>>({
        queryKey: [QueryKeys.RECEIPTER_STATISTIC_DETAIL, user_id, start_date, end_date],
        queryFn: () =>  docApi.GetReceipterStatisticDetail(user_id, start_date, end_date),
        ...options,
    })
}