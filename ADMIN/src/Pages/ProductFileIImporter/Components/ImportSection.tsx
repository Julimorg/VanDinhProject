import { Card, Alert, Divider, Button, Space, Typography } from 'antd';
import { UploadOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import FileUploadArea from './FileUploadArea';
import SelectedFileInfo from './SelectedFileInfo';
import ValidationSummary from './ValidationSummary';

const { Title } = Typography;

interface Props {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  validationResult: any;
  setValidationResult: (val: any) => void;
  isValidating: boolean;
  isImporting: boolean;
  onValidate: () => void;
  onImport: () => void;
  onDownloadTemplate: () => void;
  isDownloadingTemplate: boolean;
}

export default function ImportSection({
  selectedFile,
  setSelectedFile,
  validationResult,
  setValidationResult,
  isValidating,
  isImporting,
  onValidate,
  onImport,
  onDownloadTemplate,
  isDownloadingTemplate,
}: Props) {
  return (
    <Card title={<><UploadOutlined className="mr-2" /> Nhập sản phẩm</>} className="shadow-md h-full">
      <div className="space-y-6">
        <Alert
          message="Hướng dẫn nhập dữ liệu"
          description={
            <div className="space-y-1 text-sm">
              <p>1. Tải mẫu CSV để xem định dạng yêu cầu</p>
              <p>2. Điền dữ liệu theo đúng cấu trúc mẫu</p>
              <p>3. Upload và kiểm tra trước khi nhập chính thức</p>
            </div>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

        <Space wrap className="w-full">
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={onDownloadTemplate}
            loading={isDownloadingTemplate}
            size="large"
            block
          >
            Tải mẫu CSV
          </Button>
          <Button icon={<InfoCircleOutlined />} size="large" block>
            Xem hướng dẫn chi tiết
          </Button>
        </Space>

        <Divider />

        <Title level={5} className="!mb-4">Tải lên file CSV</Title>

        <FileUploadArea selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

        {selectedFile && (
          <SelectedFileInfo
            file={selectedFile}
            onValidate={onValidate}
            onImport={onImport}
            isValidating={isValidating}
            isImporting={isImporting}
            canImport={!!validationResult?.is_valid}
          />
        )}

        {validationResult && (
          <ValidationSummary result={validationResult} onClose={() => setValidationResult(null)} />
        )}
      </div>
    </Card>
  );
}