
import React from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface SingleImageUploadProps {
  value?: UploadFile[]; 
  onChange?: (fileList: UploadFile[]) => void; 
  accept?: string; 
  maxSize?: number; 
}

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  value = [],
  onChange,
  accept = 'image/*',
  maxSize = 2, 
}) => {
  const handleChange = (info: any) => {
    const { fileList } = info;
    const normalizedList = fileList.slice(-1); 


    if (normalizedList.length > 0 && normalizedList[0].size > maxSize * 1024 * 1024) {
      message.error(`Ảnh không được vượt quá ${maxSize}MB!`);
      return;
    }

    if (onChange) {
      onChange(normalizedList);
    }
  };

  const uploadProps = {
    fileList: value,
    onChange: handleChange,
    beforeUpload: () => false, 
    maxCount: 1,
    accept,
    listType: 'picture-card' as const,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
  };

  return (
    <Upload {...uploadProps}>
      {value.length < 1 && (
        <div>
          <UploadOutlined />
          <div>Chọn ảnh (tùy chọn)</div>
        </div>
      )}
    </Upload>
  );
};

export default SingleImageUpload;