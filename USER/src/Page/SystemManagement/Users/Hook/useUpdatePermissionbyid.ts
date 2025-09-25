import { docApi } from "@/Api/docApi";
import type {  UpdatePermissionPayload } from "@/Interface/TPermission";
import { useMutation } from "@tanstack/react-query";

export const useUpdatePermissionById = () => {
  return useMutation({
    mutationFn: ({ user_id, body }: { user_id: string; body: UpdatePermissionPayload }) =>
     docApi.updatePermissionbyid(user_id,body)
  })
}