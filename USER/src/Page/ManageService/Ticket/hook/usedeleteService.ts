import { docApi } from "@/Api/docApi";
import { QueryKeys } from "@/Constant/query-key";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { DeleteserviceRs } from "@/Interface/TServiceItems";

type UseDeleteServiceOptions = UseMutationOptions<
  DeleteserviceRs,         
  unknown,
  string                              
>;

export const useDeleteService = ( options?: UseDeleteServiceOptions) => {
  return useMutation({
    mutationKey: [QueryKeys.DELETESERVICE],
    mutationFn: (service_id: string) => docApi.deleteservice(service_id),
    ...options,
  });
};



