
import React from 'react';
import { Modal, Form, Input, Select, DatePicker, message, Upload } from 'antd';
import type { IUsersResponse } from '@/Interface/Users/IGetUsers';
import { UploadOutlined } from '@ant-design/icons';
import { useUpdateUser } from '../Hook/useUpdateUser';
import { IUpdateUserRequest } from '@/Interface/Users/IUpdateUser';

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  user?: IUsersResponse | null;
}

const UserModal: React.FC<UserModalProps> = ({ visible, onCancel, user }) => {
  const [form] = Form.useForm();


  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(user?.id || '', {
    onSuccess: () => {
      message.success('Cập nhật người dùng thành công!');
      onCancel();
    },
    onError: (error) => {
      message.error('Cập nhật thất bại: ' + (error as Error).message);
    },
  });

  //? Prefill form với dữ liệu user khi modal mở
  React.useEffect(() => {
    if (visible && user) {
      const initialValues = {
        userName: user.userName,
        email: user.email,
        status: user.status,
        roles: user.roles || [],
    
        userImg: user.userImg ? [{ uid: '-1', name: 'avatar.png', status: 'done', url: user.userImg }] : [],
      };
      form.setFieldsValue(initialValues);
    }
  }, [visible, user, form]);

  //? Reset form khi modal đóng
  React.useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleOk = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
  
    if (values.userDob) {
      values.userDob = values.userDob.format('YYYY-MM-DD');
    }
  
    if (values.userImg && values.userImg.length > 0) {

      const newFile = values.userImg.find((file: any) => file.originFileObj);
      if (newFile) {
        values.userImg = newFile.originFileObj; 
      } else {
       
        values.userImg = undefined;
      }
    } else {
      delete values.userImg; 
    }

    // console.log('Form values:', values); 

    // console.log('user.id:', user?.id); 
    if (!user?.id) {
      message.error('Không tìm thấy ID user để cập nhật!');
      return;
    }
    // console.log('Calling updateUser...');
    updateUser(values as IUpdateUserRequest);
  };

  //? getValueFromEvent để xử lý onChange của Upload trả về object, chuyển thành array
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const isLoading = isUpdating;

  return (
    <Modal
      title="Chỉnh sửa thông tin"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Cập nhật"
      cancelText="Hủy"
      width={600}
      okButtonProps={{ loading: isLoading }}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="firstName" label="Họ">
          <Input placeholder="Nhập họ" />
        </Form.Item>
        <Form.Item name="lastName" label="Tên">
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item name="userName" label="Tên người dùng">
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>
        <Form.Item
          name="userImg"
          label="Ảnh đại diện"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="userImg"
            listType="picture-card"
            beforeUpload={(file: any) => {
              //? Validate size (ví dụ: max 2MB)
              const isLt5M = file.size / 1024 / 1024 < 2;
              if (!isLt5M) {
                message.error('Ảnh không được vượt quá 5MB!');
              }
              return false; 
            }}
            maxCount={1}
            accept="image/*"
          >
            <div>
              <UploadOutlined />
              <div>Chọn ảnh (tùy chọn)</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item name="userDob" label="Ngày sinh">
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="userAddress" label="Địa chỉ">
          <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
          <Select>
            <Select.Option value="ACTIVE">Hoạt động</Select.Option>
            <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="roles" label="Vai trò" rules={[{ required: true, type: 'array', min: 1, message: 'Vui lòng chọn ít nhất một vai trò!' }]}>
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