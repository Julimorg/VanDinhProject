// File: UserModal.tsx (component mới, tách riêng)
import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space, Avatar, Tag, Spin } from 'antd';
import type { IUsersResponse, UserRoles } from '@/Interface/Users/IGetUsers';
import dayjs from 'dayjs'; // Giả sử dùng dayjs cho DatePicker, import nếu cần

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  type: 'create' | 'update' | null;
  user?: IUsersResponse | null;
}

const UserModal: React.FC<UserModalProps> = ({ visible, onCancel, type, user }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && type === 'update' && user) {
      form.setFieldsValue({
        userName: user.userName,
        email: user.email,
        status: user.status,
        // Thêm các field khác nếu cần
      });
    } else if (visible && type === 'create') {
      form.resetFields();
    }
  }, [visible, type, user, form]);

  const handleOk = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values); // Xử lý submit (gọi API tạo/cập nhật)
    // Ví dụ: if (type === 'create') { createUser(values); } else { updateUser(user?.id, values); }
    onCancel();
  };

  const title = type === 'create' ? 'Thêm mới người dùng' : type === 'update' ? 'Chỉnh sửa thông tin' : 'Xem chi tiết';

  // Để xem chi tiết, có thể set form disabled, nhưng tạm thời dùng cùng form (bạn có thể thêm prop isView để disable)

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={type === 'create' ? 'Tạo mới' : 'Cập nhật'}
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="userName" label="Tên người dùng" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="ACTIVE">Hoạt động</Select.Option>
            <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
          </Select>
        </Form.Item>
  
        <Form.Item name="roles" label="Vai trò">
          <Select mode="multiple">
            <Select.Option value="USER">Người dùng</Select.Option>
            <Select.Option value="STAFF">Nhân viên</Select.Option>
            <Select.Option value="ADMIN">Quản trị viên</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;