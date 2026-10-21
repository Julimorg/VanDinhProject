import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

interface UseImageUploadOptions {
  allowedTypes?: string[];
  maxSize?: number;
  onFileChange?: (file: File | null) => void;
}

/**
 * Hook upload anh don gian, khong phu thuoc UI library - dung voi 1 input
 * type="file" an (xem EditProfileModal.tsx de biet cach dung).
 */
export const useUploadImgFile = (options: UseImageUploadOptions = {}) => {
  const {
    allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
    maxSize = 2 * 1024 * 1024, // 2MB
    onFileChange,
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      e.target.value = ''; // cho phep chon lai cung 1 file lan nua

      if (!selected) return;

      if (!allowedTypes.includes(selected.type)) {
        toast.error('File không hợp lệ! Chỉ chấp nhận định dạng: JPG, JPEG, PNG, GIF, BMP, WEBP.');
        return;
      }

      if (selected.size > maxSize) {
        toast.error('File quá lớn! Kích thước tối đa là 2MB.');
        return;
      }

      setFile(selected);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(selected);
      });
      onFileChange?.(selected);
    },
    [allowedTypes, maxSize, onFileChange]
  );

  const reset = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFile(null);
  }, []);

  const getCurrentFile = (): File | null => file;

  return { file, previewUrl, handleFileChange, getCurrentFile, reset };
};
