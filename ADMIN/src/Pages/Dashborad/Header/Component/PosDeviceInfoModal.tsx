import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Spin, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface PosDeviceModalProps {
  visible: boolean;
  onClose: () => void;
}

const PosDeviceModal: React.FC<PosDeviceModalProps> = ({ visible, onClose }) => {
  const [ipAddress, setIpAddress] = useState<string>('Đang tải...');
  const [machineId, setMachineId] = useState<string>('Đang tải...');
  const [macAddress, setMacAddress] = useState<string>('Đang tải...');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchIpAddress = async () => {
    try {
      if (!window.electronAPI) {
        throw new Error('electronAPI không được định nghĩa');
      }
      const ip = await window.electronAPI.getIpAddress();
      setIpAddress(ip);
    } catch (error) {
      console.error('Lỗi khi lấy IP:', error);
      setIpAddress('Lỗi khi lấy IP');
    }
  };

  const fetchMachineId = async () => {
    try {
      if (!window.electronAPI) {
        throw new Error('electronAPI không được định nghĩa');
      }
      const id = await window.electronAPI.getMachineId();
      setMachineId(id);
    } catch (error) {
      console.error('Lỗi khi lấy Machine ID:', error);
      setMachineId('Lỗi khi lấy Machine ID');
    }
  };

  const fetchMacAddress = async () => {
    try {
      if (!window.electronAPI) {
        throw new Error('electronAPI không được định nghĩa');
      }
      const mac = await window.electronAPI.getMacAddress();
      setMacAddress(mac);
    } catch (error) {
      console.error('Lỗi khi lấy MAC:', error);
      setMacAddress('Lỗi khi lấy MAC');
    }
  };

  useEffect(() => {
    if (window.electronAPI) {
      setLoading(true);
      Promise.all([fetchIpAddress(), fetchMachineId(), fetchMacAddress()])
        .finally(() => setLoading(false));
    } else {
      console.error('electronAPI không khả dụng khi component mount');
      setIpAddress('Lỗi: electronAPI không khả dụng');
      setMachineId('Lỗi: electronAPI không khả dụng');
      setMacAddress('Lỗi: electronAPI không khả dụng');
      setLoading(false);
    }
  }, []);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Thông tin máy
          </Typography.Title>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <Typography.Text style={{ display: 'block', marginTop: '10px' }}>
            Đang tải thông tin...
          </Typography.Text>
        </div>
      ) : (
        <Descriptions
          bordered
          column={1}
          labelStyle={{ width: '30%', fontWeight: 'bold' }}
          contentStyle={{ width: '70%' }}
        >
          <Descriptions.Item label="Địa chỉ IP">
            {ipAddress.includes('Lỗi') ? (
              <Typography.Text type="danger">
                <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                {ipAddress}
              </Typography.Text>
            ) : (
              <Typography.Text>{ipAddress}</Typography.Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Machine ID">
            {machineId.includes('Lỗi') ? (
              <Typography.Text type="danger">
                <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                {machineId}
              </Typography.Text>
            ) : (
              <Typography.Text>{machineId}</Typography.Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ MAC">
            {macAddress.includes('Lỗi') ? (
              <Typography.Text type="danger">
                <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                {macAddress}
              </Typography.Text>
            ) : (
              <Typography.Text>{macAddress}</Typography.Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default PosDeviceModal;