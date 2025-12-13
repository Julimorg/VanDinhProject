import { useMutation } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { IExportExcelFileRequest } from '@/Interface/File/IExportExcelFile';

export const useExportExcel = () => {
  return useMutation({
    mutationFn: async ({ userId, startDate, endDate }: { userId: string; startDate: Dayjs; endDate: Dayjs }) => {
      const startDateStr = startDate.format('YYYY-MM-DD');
      const endDateStr = endDate.format('YYYY-MM-DD');
      
      const body: IExportExcelFileRequest = {
        userId,
        startDate: startDateStr,
        endDate: endDateStr,
      };
      
      const blob = await docApi.ExportUsersExcel(body);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with date range
      const filename = `Danh_sach_nguoi_dung_${startDate.format('DD-MM-YYYY')}_${endDate.format('DD-MM-YYYY')}.xlsx`;
      link.setAttribute('download', filename);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return blob;
    },
    onSuccess: () => {
      message.success('Đã xuất Excel thành công!');
    },
    onError: (error: any) => {
      console.error('Lỗi khi xuất Excel:', error);
      message.error('Có lỗi xảy ra khi xuất Excel');
    },
  });
};

