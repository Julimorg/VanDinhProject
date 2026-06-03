
import { docApi } from '@/Api/docApi';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

const downloadEXCELFromBase64 = (base64: string, filename: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { 
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
});

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const useExportDiaryExcelFile = () => {
  return useMutation({
    mutationFn: async ({ userId, diaryId }: { userId: string; diaryId: string }) => {
      return await docApi.ExportDiaryExcelFile(userId, diaryId);
    },
    onSuccess: (response: any, { userId, diaryId }: { userId: string; diaryId: string }) => {

      const base64 = response?.data ?? response;
      downloadEXCELFromBase64(base64, `phieu-nhap-kho-${diaryId}.xlsx`);
      message.success('Xuất Excel thành công!');
    },
    onError: (error: any) => {
      console.error('Lỗi khi xuất Excel:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi xuất Excel');
    },
  });
};