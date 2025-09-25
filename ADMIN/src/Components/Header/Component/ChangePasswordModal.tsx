import { Modal, Form, Input } from 'antd';
import { useState } from 'react';
import { ChangePass } from '@/Interface/TChangePass';
import { useChangePass } from '../Hook/useChangePassword';
import { toast } from 'react-toastify';
import { showToastErrors } from '@/Utils/toast_errors';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useChangePass();

  const handleSubmit = async (values: ChangePass) => {
    setLoading(true);
    try {
      await mutateAsync(values);
      toast.success('Đổi mật khẩu thành công!');
      form.resetFields();
      onClose();
    } catch (err: any) {
      showToastErrors(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={loading}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mật khẩu hiện tại"
          name="OldPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="NewPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
