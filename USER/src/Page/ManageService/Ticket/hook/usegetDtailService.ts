import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import type { DetailService } from "@/Interface/TServiceItems";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";




type UseDetailServiceOptions = Omit<UseQueryOptions<DetailService,unknown>,
"queryKey"|"queryFn">;

export const useDetailSevice = (service_id:string,options?:UseDetailServiceOptions)=>{
    return useQuery({
        ...options,
        queryKey:[QueryKeys.DETAILSERVICE,service_id],
        queryFn:()=>docApi.getDetailService(service_id),
        enabled:!!service_id
    })
}