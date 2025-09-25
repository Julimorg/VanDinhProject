import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { docApi } from '@/Api/docApi';
import type { CreatePermission, CreatePermissionRs } from '@/Interface/TPermission';
import { QueryKeys } from '@/Constant/query-key';

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePermissionRs, unknown, CreatePermission>({
    mutationFn: (payload) => docApi.createPermission(payload),
    onSuccess: () => {
      message.success('Tạo quyền thành công');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PERMISSION] }); 
    },
    onError: () => {
      message.error('Tạo quyền thất bại');
    },
  });
};