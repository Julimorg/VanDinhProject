import { docApi } from '@/Api/docApi';
import { IImportRowError } from '@/Interface/Product/IImportExcelFile';
import { downloadBinaryFromBase64 } from '@/Utils/ulti';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export interface ImportExcelError extends Error {
  rowErrors?: IImportRowError[];
}

//? Import file Excel sản phẩm — rollback toàn bộ nếu có dòng lỗi
export const useImportProductExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        return await docApi.ImportProductsExcel(file);
      } catch (err: any) {
        const rowErrors: IImportRowError[] | undefined = err?.response?.data?.data;
        const errMessage = err?.response?.data?.message || 'Import Excel thất bại';
        const customError: ImportExcelError = new Error(errMessage);
        customError.rowErrors = rowErrors;
        throw customError;
      }
    },
    onSuccess: (data) => {
      message.success(data.message || `Import thành công ${data.data?.importedCount ?? 0} sản phẩm!`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: ImportExcelError) => {
      console.error('Lỗi khi import Excel:', error);
      if (!error.rowErrors?.length) {
        message.error(error.message || 'Có lỗi xảy ra khi import Excel');
      }
      // Nếu có rowErrors, component tự hiển thị chi tiết qua modal (xem ProductList.tsx)
    },
  });
};

//? Tải template Excel để điền data trước khi import
export const useDownloadProductImportTemplate = () => {
  return useMutation({
    mutationFn: async () => {
      return await docApi.DownloadProductImportTemplate();
    },
    onSuccess: (res) => {
      const base64 = res.data;
      if (!base64) {
        message.error('Không nhận được dữ liệu template');
        return;
      }
      downloadBinaryFromBase64(base64, 'product_import_template.xlsx');
      message.success('Đã tải template thành công!');
    },
    onError: (error: any) => {
      console.error('Lỗi khi tải template:', error);
      message.error('Có lỗi xảy ra khi tải template');
    },
  });
};