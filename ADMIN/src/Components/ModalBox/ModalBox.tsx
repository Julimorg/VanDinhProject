import React, { useState, ReactNode } from 'react';
import { Button, Modal } from 'antd';

interface ModalBoxProps {
  title?: string;
  children: ReactNode;
  okText?: string;
  cancelText?: string;
  width?: string | number;
  height?: string | number;
  onOk?: () => void;
  onCancel?: () => void;
  className?: string;
}

const ModalBox: React.FC<ModalBoxProps> = ({
  title = 'Modal Title',
  children,
  okText = 'OK',
  cancelText = 'Cancel',
  width = 'max-w-lg',
  height = 'auto',
  onOk,
  onCancel,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOk = () => {
    setIsModalOpen(false);
    if (onOk) onOk();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onCancel) onCancel();
  };

  const modalClassName = `rounded-xl shadow-2xl bg-white ${className}`;

  const modalStyle = {
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
  };

  return (
    <Modal
      title={<span className="text-xl font-bold text-gray-900 tracking-tight">{title}</span>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={okText}
      cancelText={cancelText}
      closable
      className={`${modalClassName} ${typeof width === 'string' ? width : ''} ${
        typeof height === 'string' ? height : ''
      }`}
      style={modalStyle}
      footer={[
        <Button
          key="cancel"
          onClick={handleCancel}
          className="mr-2 border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900 rounded-lg px-4 py-2 transition-colors duration-200"
        >
          {cancelText}
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={handleOk}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors duration-200"
        >
          {okText}
        </Button>,
      ]}
    >
      <div className="p-6 text-gray-800">{children}</div>
    </Modal>
  );
};

export default ModalBox;
