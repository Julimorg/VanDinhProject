import { docApi } from "@/Api/docApi";
import type { CodeRemoveRs } from "@/Interface/TDiscountCode";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";




type UseRemoveDiscountCodeOptions = UseMutationOptions<CodeRemoveRs,Error>;

export const useRemoveDiscountCode =(id:string,options?:UseRemoveDiscountCodeOptions)=>{
    return useMutation({
        mutationFn:()=>docApi.removeDiscountCode(id),
        ...options
    })
}