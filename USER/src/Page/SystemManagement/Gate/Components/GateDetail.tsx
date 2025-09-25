import { Button, Card, Descriptions, Spin, Table, Tag, message } from 'antd';
import { useState, type FC } from 'react';
import { useParams } from 'react-router-dom';

import GateConfigModal from './GateConfigModal';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useMQTT } from '@/Context';
import { useConfigGateById } from '../Hooks/useQueryGate';
import { GateCommand } from '@/Constant/Status';

const GateDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const { publish } = useMQTT();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { getGateById } = useConfigGateById(id || '');

  const handleApplyConfig = () => {
    try {
      if (!getGateById.data?.data) return;

      publish(
        'command',
        JSON.stringify({
          cmd: GateCommand.SYNC_CONFIG,
          client_id: getGateById.data.data.serialNo,
        })
      );
      message.success('Đã gửi lệnh áp dụng cấu hình');
    } catch (error) {
      message.error('Không thể gửi lệnh áp dụng cấu hình. Vui lòng thử lại.');
    }
  };

  const columns = [
    {
      title: 'Key Config',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Giá trị mặc định',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
    },
  ];

  if (getGateById.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!getGateById.data?.data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Không tìm thấy thông tin cổng</p>
      </div>
    );
  }

  const gate = getGateById.data.data;

  return (
    <div className="mt-1">
      <Card title="Thông tin chi tiết cổng" className="mb-4">
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Tên cổng" span={3}>
            {gate.name}
          </Descriptions.Item>
          <Descriptions.Item label="Serial No" span={3}>
            {gate.serialNo}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={3}>
            <Tag
              color={gate.state ? 'success' : 'error'}
              icon={gate.state ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            >
              {gate.state ? 'Đã kết nối' : 'Mất kết nối'}
            </Tag>
          </Descriptions.Item>

          {/* <Descriptions.Item label="Phiên bản firmware" span={3}>
            {gate.firmwareVersion}
          </Descriptions.Item> */}
        </Descriptions>
      </Card>

      <Card
        title="Cấu hình cổng"
        extra={
          <div className="flex gap-2">
            <Button type="primary" onClick={() => setIsConfigModalOpen(true)}>
              Chỉnh sửa cấu hình
            </Button>
            {/* <Button onClick={handleApplyConfig}>Áp dụng cấu hình</Button> */}
            <Button variant="solid" color="gold" onClick={handleApplyConfig} className="flex-1 ">
              Áp dụng cấu hình
            </Button>
          </div>
        }
      >
        <Table columns={columns} dataSource={gate.configs} rowKey="key" pagination={false} />
      </Card>

      <GateConfigModal
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        gate={gate}
      />
    </div>
  );
};

export default GateDetail;
