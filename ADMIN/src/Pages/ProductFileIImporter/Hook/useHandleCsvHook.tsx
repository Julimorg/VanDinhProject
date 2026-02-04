import { docApi } from '@/Api/docApi';
import { validateCsvFile, downloadCsvFromBase64 } from '@/Utils/ulti';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';


// Hook để import CSV
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
      queryClient.invalidateQueries({ queryKey: ['recent-imports'] });
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

// Hook để export by category
export const useExportByCategory = () => {
  return useMutation({
    mutationFn: async (categoryId: string) => {
      return await docApi.ExportProductsByCategory(categoryId);
    },
    onSuccess: (data) => {
      const { file_content_base64, file_name } = data.data;
      downloadCsvFromBase64(file_content_base64, file_name);
      message.success(`Đã xuất ${data.data.total_records} sản phẩm theo danh mục!`);
    },
    onError: (error: any) => {
      console.error('Lỗi khi export theo category:', error);
      message.error('Có lỗi xảy ra khi export');
    },
  });
};

// Hook để export by supplier
export const useExportBySupplier = () => {
  return useMutation({
    mutationFn: async (supplierId: string) => {
      return await docApi.ExportProductsBySupplier(supplierId);
    },
    onSuccess: (data) => {
      const { file_content_base64, file_name } = data.data;
      downloadCsvFromBase64(file_content_base64, file_name);
      message.success(`Đã xuất ${data.data.total_records} sản phẩm theo nhà cung cấp!`);
    },
    onError: (error: any) => {
      console.error('Lỗi khi export theo supplier:', error);
      message.error('Có lỗi xảy ra khi export');
    },
  });
};

// Hook để get recent imports (useQuery)
export const useRecentImports = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent-imports', limit],
    queryFn: async () => {
      return await docApi.GetRecentImports(limit);
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};