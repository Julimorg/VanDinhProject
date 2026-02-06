import { Modal, Statistic, Typography, List, Row, Col, Button } from 'antd';
import { FileTextOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  validationResult: any;
  onImport: () => void;
  isImporting: boolean;
}

export default function ValidationModal({
  open,
  onClose,
  validationResult,
  onImport,
  isImporting,
}: Props) {
  if (!validationResult) return null;

  return (
    <Modal
      title="Kết quả kiểm tra dữ liệu"
      open={open}
      onCancel={onClose}
      width={720}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="import"
          type="primary"
          onClick={onImport}
          disabled={!validationResult.is_valid}
          loading={isImporting}
        >
          <UploadOutlined /> Nhập dữ liệu
        </Button>,
      ]}
    >
      <div className="space-y-6">
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Tổng dòng" value={validationResult.total_rows} prefix={<FileTextOutlined />} />
          </Col>
          <Col span={8}>
            <Statistic
              title="Lỗi"
              value={validationResult.errors.length}
              valueStyle={{ color: validationResult.errors.length ? '#cf1322' : '#52c41a' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Cảnh báo"
              value={validationResult.warnings?.length || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Col>
        </Row>

        {validationResult.errors.length > 0 && (
          <div>
            <Title level={5} type="danger">Lỗi</Title>
            <List
              size="small"
              dataSource={validationResult.errors}
              renderItem={(item: string) => <List.Item><span className="text-red-600">• {item}</span></List.Item>}
            />
          </div>
        )}

        {validationResult.warnings?.length > 0 && (
          <div>
            <Title level={5} type="warning">Cảnh báo</Title>
            <List
              size="small"
              dataSource={validationResult.warnings}
              renderItem={(item: string) => <List.Item><span className="text-orange-600">• {item}</span></List.Item>}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}