import { docApi } from '@/Api/docApi';
import { validateCsvFile, downloadCsvFromBase64 } from '@/Utils/ulti';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useImportCsv = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      // Validate file trước
      const validation = validateCsvFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      return await docApi.ImportProductsCsv(file);
    },
    onSuccess: (data) => {
      message.success(data.message || 'Import CSV thành công!');
      // Invalidate queries để refresh data
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      console.error('Lỗi khi import CSV:', error);
      message.error(error.message || 'Có lỗi xảy ra khi import CSV');
    },
  });
};

// Hook để validate CSV
export const useValidateCsv = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      // Validate file trước
      const validation = validateCsvFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      return await docApi.ValidateProductsCsv(file);
    },
    onSuccess: (data) => {
      if (data.data.is_valid) {
        message.success('File CSV hợp lệ!');
      } else {
        message.warning(`File CSV có ${data.data.error_count} lỗi!`);
      }
    },
    onError: (error: any) => {
      console.error('Lỗi khi validate CSV:', error);
      message.error(error.message || 'Có lỗi xảy ra khi validate CSV');
    },
  });
};

// Hook để download template
export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: async () => {
      return await docApi.DownloadCsvTemplate();
    },
    onSuccess: (data) => {
      const { file_content_base64, file_name } = data.data;
      downloadCsvFromBase64(file_content_base64, file_name);
      message.success('Đã tải template CSV thành công!');
    },
    onError: (error: any) => {
      console.error('Lỗi khi tải template:', error);
      message.error('Có lỗi xảy ra khi tải template');
    },
  });
};

// Hook để export all products
export const useExportAllProducts = () => {
  return useMutation({
    mutationFn: async () => {
      return await docApi.ExportAllProductsCsv();
    },
    onSuccess: (data) => {
      const { file_content_base64, file_name } = data.data;
      downloadCsvFromBase64(file_content_base64, file_name);
      message.success(`Đã xuất ${data.data.total_records} sản phẩm thành công!`);
    },
    onError: (error: any) => {
      console.error('Lỗi khi export CSV:', error);
      message.error('Có lỗi xảy ra khi export CSV');
    },
  });
};