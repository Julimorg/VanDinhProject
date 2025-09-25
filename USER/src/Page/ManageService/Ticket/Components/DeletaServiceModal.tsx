import React from 'react';
import { Modal } from 'antd';

type DeleteServiceModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  serviceName?: string;
  confirmLoading?: boolean;
  isUnlocking?: boolean;
};

const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  serviceName,
  confirmLoading = false,
  isUnlocking = false,
}) => {
  return (
    <Modal
      title={isUnlocking ? 'Xác nhận mở khóa' : 'Xác nhận khóa'}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={isUnlocking ? 'Mở khóa' : 'Khóa'}
      cancelText="Hủy"
      okButtonProps={{ danger: !isUnlocking }}
      confirmLoading={confirmLoading}
    >
      <p>
        Bạn có chắc chắn muốn {isUnlocking ? 'mở khóa' : 'khóa'} dịch vụ{' '}
        <strong>{serviceName}</strong> không?
      </p>
    </Modal>
  );
};

export default DeleteServiceModal;
