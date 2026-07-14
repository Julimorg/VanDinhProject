import { docApi } from '@/Api/docApi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const printPDFFromBase64 = (base64: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  // Tạo iframe ẩn để load PDF rồi gọi lệnh in — không cần tải file về máy
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.src = url;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Lỗi khi mở hộp thoại in:', e);
      toast.error('Không thể mở hộp thoại in. Vui lòng thử lại.');
    }
  };

  // Dọn dẹp iframe sau khi in xong. Trình duyệt không có sự kiện "in xong" đáng tin cậy
  // trên mọi trình duyệt nên dùng timeout dự phòng (đủ thời gian cho người dùng thao tác).
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
    URL.revokeObjectURL(url);
  }, 60000);
};

export const usePrintDiaryInvoicePdf = () => {
  return useMutation({
    mutationFn: async ({ diaryId }: { diaryId: string }) => {
      return await docApi.ExportDiaryInvoicePdf(diaryId);
    },
    onSuccess: (response: any) => {
      const base64 = response?.data ?? response;
      printPDFFromBase64(base64);
    },
    onError: (error: any) => {
      console.error('Lỗi khi in hóa đơn:', error);
      toast.error(error?.message || 'Có lỗi xảy ra khi in hóa đơn');
    },
  });
};