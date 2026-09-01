import { useMutation, useQueryClient } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { QueryKeys } from '@/Constant/query-key';
import { toast } from 'react-toastify';

type ImportColorJsonParams = {
  supplierId: string;
  file: File;
};

export const useImportColorJson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supplierId, file }: ImportColorJsonParams) =>
      docApi.ImportColorJson(supplierId, file),
    onSuccess: (response) => {
      if (response && response.data && 'success' in response.data && response.data.success) {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_COLOR_BY_SUPPLIER] });
      }
      //? success=false: đây vẫn là response 200 bình thường (validate lỗi theo dòng, không throw)
      //? để component tự xử lý hiển thị errors, không toast ở đây
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Import JSON thất bại, vui lòng thử lại!');
    },
  });
};