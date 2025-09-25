import React from 'react';
import { Modal, Form, Input } from 'antd';
import type { CreatePermission } from '@/Interface/TPermission';

interface CreatePermissionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePermission) => Promise<void>;
}

const CreatePermissionModal: React.FC<CreatePermissionModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);

      form.resetFields();
      onClose();
    } catch (error) {
      //   message.error('Vui lòng kiểm tra lại thông tin');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Tạo quyền mới"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Tạo"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên quyền"
          name="permission_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên quyền' }]}
        >
          <Input placeholder="Nhập tên quyền" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả quyền" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePermissionModal;
