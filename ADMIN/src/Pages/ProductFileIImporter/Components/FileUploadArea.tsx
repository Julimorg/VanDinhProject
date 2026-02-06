import { CloudUploadOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';

interface Props {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export default function FileUploadArea({ selectedFile, setSelectedFile }: Props) {
  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    beforeUpload: (file: File) => {
      setSelectedFile(file);
      return false;
    },
    onRemove: () => setSelectedFile(null),
  };

  return (
    <Dragger
      {...uploadProps}
      className="bg-gray-50 border-2 border-dashed hover:border-blue-400 transition-colors"
    >
      <p className="ant-upload-drag-icon">
        <CloudUploadOutlined className="text-5xl text-blue-500" />
      </p>
      <p className="ant-upload-text text-lg font-semibold">
        Click hoặc kéo thả file CSV vào đây
      </p>
      <p className="ant-upload-hint text-sm">Chỉ hỗ trợ 1 file • Dung lượng tối đa 10MB</p>
    </Dragger>
  );
}