import { Button, Space, Typography } from 'antd';
import { FileExcelOutlined, CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Props {
  file: File;
  onValidate: () => void;
  onImport: () => void;
  isValidating: boolean;
  isImporting: boolean;
  canImport: boolean;
}

export default function SelectedFileInfo({
  file,
  onValidate,
  onImport,
  isValidating,
  isImporting,
  canImport,
}: Props) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileExcelOutlined className="text-3xl text-green-600" />
          <div>
            <Text strong className="block">{file.name}</Text>
            <Text type="secondary" className="text-xs">
              {(file.size / 1024).toFixed(2)} KB
            </Text>
          </div>
        </div>

        <Space wrap>
          <Button
            type="default"
            icon={<CheckCircleOutlined />}
            onClick={onValidate}
            loading={isValidating}
          >
            Kiểm tra dữ liệu
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={onImport}
            loading={isImporting}
            disabled={!canImport}
          >
            Nhập dữ liệu
          </Button>
        </Space>
      </div>
    </div>
  );
}