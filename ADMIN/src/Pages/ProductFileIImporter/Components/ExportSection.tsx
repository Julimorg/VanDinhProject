import { Card, Alert, Button, Statistic, Typography } from 'antd';
import { DownloadOutlined, FileExcelOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Props {
  totalProducts: number;
  onExportAll: () => void;
  isExporting: boolean;
}

export default function ExportSection({ totalProducts, onExportAll, isExporting }: Props) {
  return (
    <Card title={<><DownloadOutlined className="mr-2" /> Xuất sản phẩm</>} className="shadow-md h-full">
      <div className="space-y-6">
        <Alert
          message="Xuất toàn bộ cơ sở dữ liệu"
          description="Tải xuống tất cả sản phẩm dưới dạng CSV"
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

        <Card className="border-2 border-blue-200 bg-blue-50">
          <div className="text-center space-y-4">
            <FileExcelOutlined className="text-6xl text-blue-500" />
            <div>
              <Title level={4}>Xuất tất cả sản phẩm</Title>
              <Paragraph type="secondary">File sẽ có đúng định dạng mẫu</Paragraph>
            </div>

            <Statistic
              title="Sản phẩm hiện có"
              value={totalProducts}
              prefix={<FileExcelOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />

            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={onExportAll}
              loading={isExporting}
              size="large"
              block
            >
              Xuất file ngay
            </Button>
          </div>
        </Card>
      </div>
    </Card>
  );
}