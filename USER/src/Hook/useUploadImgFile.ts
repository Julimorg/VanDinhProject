import { useState, useCallback } from 'react'; 
import { message } from 'antd';
import type { UploadProps, UploadFile, UploadChangeParam, RcFile } from 'antd/es/upload';

interface UseImageUploadOptions {
  allowedTypes?: string[];
  maxSize?: number;
  maxCount?: number;
  onFileChange?: (file: File | null) => void;
  listType?: 'picture' | 'picture-circle';
}

export const useUploadImgFile = (options: UseImageUploadOptions = {}) => {
  const {
    allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
    maxSize = 2 * 1024 * 1024, // 2MB
    maxCount = 1,
    onFileChange,
    listType = 'picture',
  } = options;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Xử lý thay đổi file upload (giữ nguyên)
  const handleUploadChange = ({ fileList: newFileList }: UploadChangeParam<UploadFile>) => {
    let updatedFileList = [...newFileList];

    const currentFile = updatedFileList[updatedFileList.length - 1];
    if (currentFile?.status === 'uploading') {
      const rawFile = currentFile.originFileObj as RcFile;

      if (!allowedTypes.includes(rawFile.type)) {
        message.error('File không hợp lệ! Chỉ chấp nhận định dạng: JPG, JPEG, PNG, GIF, BMP, WEBP.');
        updatedFileList = updatedFileList.slice(0, -1);
        return;
      }

      if (rawFile.size && rawFile.size > maxSize) {
        message.error('File quá lớn! Kích thước tối đa là 2MB.');
        updatedFileList = updatedFileList.slice(0, -1);
        return;
      }

      updatedFileList = updatedFileList.map((file) =>
        file.uid === currentFile.uid
          ? {
              ...file,
              status: 'done',
              url: URL.createObjectURL(rawFile),
            }
          : file
      );
      message.success('File ảnh hợp lệ đã được chọn!');
    }

    updatedFileList = updatedFileList.slice(-maxCount);

    setFileList(updatedFileList);

    const currentRawFile = updatedFileList[0]?.originFileObj || null;
    onFileChange?.(currentRawFile);
  };

  // Props cho Upload (giữ nguyên)
  const uploadProps: UploadProps = {
    fileList,
    onChange: handleUploadChange,
    beforeUpload: () => false,
    maxCount,
    listType,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
  };

  // Lấy file hiện tại (giữ nguyên)
  const getCurrentFile = (): File | null => fileList[0]?.originFileObj || null;

  // Reset với useCallback để ổn định (tránh re-render loop)
  const reset = useCallback(() => {
    setFileList([]);
  }, []);

  return {
    uploadProps,
    fileList,
    getCurrentFile,
    reset,
  };
};