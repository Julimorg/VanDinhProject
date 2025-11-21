import React from 'react';
import { Modal } from 'antd';
import { CheckCircleTwoTone, LoadingOutlined } from '@ant-design/icons';

interface IAddToCartModalProps {
    visible: boolean;
    productName?: string;
    status: 'loading' | 'success';
}

const AddToCartModal: React.FC<IAddToCartModalProps> = ({ visible, productName, status }) => {
    return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
    >
      <div className="flex flex-col items-center gap-4 py-6 text-center">

        {status === 'loading' ? (
          <LoadingOutlined className="text-4xl animate-spin" />
        ) : (
          <CheckCircleTwoTone twoToneColor="#52c41a" className="text-5xl" />
        )}

        {status === 'loading' ? (
          <p className="text-gray-800 text-base">
            Đang thêm <strong>{productName}</strong> vào giỏ hàng...
          </p>
        ) : (
          <p className="text-green-700 text-base font-medium">
            <strong>{productName}</strong> đã được thêm thành công!
          </p>
        )}
      </div>
    </Modal>
  );
}

export default AddToCartModal;