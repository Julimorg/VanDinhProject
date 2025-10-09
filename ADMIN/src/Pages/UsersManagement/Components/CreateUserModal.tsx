import React from 'react';
import { Modal, Form, Input, Select, Upload, DatePicker, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; 
import type { UploadProps } from 'antd/es/upload';
// import type { RcFile } from 'antd/es/upload/interface'; 
import { useCreateUser } from '../Hook/useCreateUser';
import { ICreateUserRequest } from '@/Interface/Users/ICreateUser';

interface UserCreateModalProps {
  visible: boolean;
  onCancel: () => void;
}

const UserCreateModal: React.FC<UserCreateModalProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();

  const { mutate: createUser, isPending } = useCreateUser({
    onSuccess: () => {
      message.success('Tạo người dùng thành công!');
      form.resetFields(); 
      onCancel();
    },
    onError: (err) => {
      message.error(`Lỗi tạo người dùng: ${err.message || 'Có lỗi xảy ra'}`);
    },
  });

  const handleOk = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
  
    const body: ICreateUserRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      userName: values.userName,
      password: values.password,
      email: values.email,
      phone: values.phone,
      userDob: dayjs(values.userDob).format('YYYY-MM-DD'), 
      userAddress: values.userAddress,
      roles: values.roles || [], 
      userImg: (values.userImg?.[0] as any)?.originFileObj as File,
    };

    console.log('Form values for create:', body); 

  
    createUser(body);
  };

  const uploadProps: UploadProps = {
    name: 'userImg',
    listType: 'picture-circle',
    maxCount: 1,
    beforeUpload: () => false,
    onRemove: (file) => {
      console.log('Xóa file:', file);
      return true;
    },
  };

  return (
    <Modal
      title="Thêm mới người dùng"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Tạo mới"
      cancelText="Hủy"
      width={600}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      confirmLoading={isPending}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="userImg"
          label="Ảnh đại diện (userImg)"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload {...uploadProps}>
            <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="firstName" label="Họ (firstName)" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
          <Input placeholder="Nhập họ" />
        </Form.Item>
        <Form.Item name="lastName" label="Tên (lastName)" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item name="userName" label="Tên đăng nhập (userName)" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu (password)" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự!' }]}>
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item name="email" label="Email (email)" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại (phone)" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải là 10-11 chữ số!' }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item name="userDob" label="Ngày sinh (userDob)" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="userAddress" label="Địa chỉ (userAddress)" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
        </Form.Item>
        <Form.Item name="roles" label="Vai trò (roles)" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
          <Select mode="multiple">
            <Select.Option value="STAFF">STAFF</Select.Option>
            <Select.Option value="ADMIN">ADMIN</Select.Option>
            <Select.Option value="USER">USER</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateModal;