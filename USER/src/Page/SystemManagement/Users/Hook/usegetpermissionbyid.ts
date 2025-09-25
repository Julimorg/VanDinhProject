
import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import type { Permission } from '@/Interface/TPermission';
import { useQuery } from '@tanstack/react-query';


export const useGetPermissionById = (user_id: string,enabled = true) => {
  return useQuery<Permission[]>({
    queryKey: [QueryKeys.PERMISSIONBYID, user_id],
    queryFn: () => docApi.getPermissonbyid(user_id),
    enabled: !!user_id &&enabled
  });
};
