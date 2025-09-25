import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type {  ReceipterStatisticResponseData } from "@/Interface/TRevenue";
import {  useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type UseGetReceipterStatisticOptions = Omit<UseQueryOptions<ReceipterStatisticResponseData,AxiosError<{message?: string}>>, "queryKey" | "queryFn">;

export const useGetReceipterStatistic = (start_date: string, end_date: string, options?: UseGetReceipterStatisticOptions) => {
    return useQuery<ReceipterStatisticResponseData, AxiosError<{message?: string}>>({
        queryKey: [QueryKeys.RECEIPTER_STATISTIC],
        queryFn: () => docApi.GetReceipterStatistic(start_date, end_date),
        ...options,
    })
}