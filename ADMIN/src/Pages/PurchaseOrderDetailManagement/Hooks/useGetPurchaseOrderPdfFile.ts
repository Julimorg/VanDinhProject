
import { docApi } from '@/Api/docApi';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

const downloadPDFFromBase64 = (base64: string, filename: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const useExportPurchasePDF = () => {
  return useMutation({
    mutationFn: async (purchaseOrderId: string) => {
      return await docApi.ExportPurchasePDFFile(purchaseOrderId);
    },
    onSuccess: (response: any, purchaseOrderId) => {

      const base64 = response?.data ?? response;
      downloadPDFFromBase64(base64, `phieu-nhap-kho-${purchaseOrderId}.pdf`);
      message.success('Xuất PDF thành công!');
    },
    onError: (error: any) => {
      console.error('Lỗi khi xuất PDF:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi xuất PDF');
    },
  });
};