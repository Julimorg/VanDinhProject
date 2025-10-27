// File: src/components/Color/DeleteColorModal.tsx
import React from 'react';
import { Modal } from 'antd';

interface DeleteColorModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  colorName: string;
}

const DeleteColorModal: React.FC<DeleteColorModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  colorName,
}) => {
  return (
    <Modal
      title="Xác nhận xóa"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa"
      okType="danger"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa mã màu "{colorName}" không? Hành động này không thể hoàn tác.</p>
    </Modal>
  );
};

export default DeleteColorModal;