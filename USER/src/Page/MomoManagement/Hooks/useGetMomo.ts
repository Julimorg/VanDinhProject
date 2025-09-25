import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { MomoResponse } from "@/Interface/TMomo";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";


type UseGetMomoOptions = Omit<UseQueryOptions<MomoResponse, unknown>, 'queryKey' | 'queryFn'>;

export const useGetMomo = (options?: UseGetMomoOptions) => {
    return useQuery<MomoResponse,unknown>({
        queryKey: [QueryKeys.GET_MOMO],
        queryFn: () => docApi.GetMomo(),
        ...options
    })
}
