import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { StatisticResponse } from "@/Interface/TRevenue";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";


type UseGetStatistictOption = Omit<UseQueryOptions<StatisticResponse, AxiosError<{message?: string}>>, "queryKey" | "queryFn">;


export const useGetStatisticOption = (start_date: string, end_date: string, options?: UseGetStatistictOption ) => {
    return useQuery<StatisticResponse, AxiosError<{message?:string}>>({
        queryKey : [QueryKeys.STATISTIC],
        queryFn: () => docApi.StatisticRevenue(start_date, end_date),
        retry: false,
        ...options
    })
}