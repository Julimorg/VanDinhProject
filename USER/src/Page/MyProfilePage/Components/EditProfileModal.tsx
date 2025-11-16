import React, { useEffect } from 'react';
import { Button, Upload, Modal, message, Form, Input, DatePicker, Spin } from 'antd'; 
import { UploadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useUploadImgFile } from '../../../Hook/useUploadImgFile';
import { useUpdateMyProfile } from '../Hook/useUpdateUser';
import { toast } from 'react-toastify';
import type { IUdpateMyProfileRequest } from '../../../Interface/Users/IUpdateMyProfile';


interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  userImg?: string;
  phone: string;
  userAddress: string;
  userDob: string; 
  status: string;
}

interface EditForm {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  userAddress: string;
  userDob: Dayjs; 
  userImg?: File; 
}

interface EditProfileModalProps {
  open: boolean;
  userData: UserData;
  onCancel: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, userData, onCancel }) => {
  const [form] = Form.useForm<EditForm>();

  const { uploadProps, getCurrentFile, reset } = useUploadImgFile({
    maxSize: 2 * 1024 * 1024,
    maxCount: 1,
    onFileChange: (file: File | null) => {
      if (file) {
        form.setFieldsValue({ userImg: file }); 
        message.success('File ảnh đã được chọn!');
      } else {
        form.setFieldsValue({ userImg: undefined });
      }
    },
    listType: 'picture', 
  });

  const { mutate: updateProfile, isPending } = useUpdateMyProfile(userData.id, {
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công!');
      form.resetFields(); 
      reset(); 
      onCancel();
    },
    onError: (error) => {
      toast.error(`Lỗi cập nhật: ${error.message || 'Vui lòng thử lại!'}`);
    },
  });

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        phone: userData.phone,
        userAddress: userData.userAddress,
        userDob: dayjs(userData.userDob), 
        userImg: undefined, 
      });
      reset(); 
    }
  }, [open, userData, form, reset]);


  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const requestBody: IUdpateMyProfileRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.userName,
        email: values.email,
        phone: values.phone,
        userAddress: values.userAddress,
        userDob: values.userDob.format('YYYY-MM-DD'), 
        userImg: values.userImg, 
      };

      updateProfile(requestBody);
    } catch (error) {
      message.error(`Vui lòng kiểm tra thông tin - ${error}`);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    reset(); 
    onCancel();
  };

  if (!open) return null;

  return (
    <Modal
      title="Chỉnh sửa thông tin cá nhân"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" size="large" onClick={handleCancel} disabled={isPending}>
          Hủy
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          size="large" 
          onClick={handleSave}
          loading={isPending}
          disabled={isPending}
        >
          {isPending ? <Spin size="small" /> : 'Lưu thay đổi'}
        </Button>,
      ]}
      width={800}
      destroyOnClose
      maskClosable={false}
      bodyStyle={isPending ? { opacity: 0.6, pointerEvents: 'none' } : {}}
    >
      <Form form={form} layout="vertical" className="space-y-4">
        <Form.Item label={<span className="text-sm">Ảnh đại diện (JPG, PNG, max 2MB)</span>} name="userImg">
          <Upload
            {...uploadProps}
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
          >
            <Button icon={<UploadOutlined />} size="small">Chọn ảnh</Button> 
          </Upload>
          {getCurrentFile() && (
            <div className="mt-2 flex items-center gap-2">
              <img
                src={URL.createObjectURL(getCurrentFile()!)}
                alt="Avatar preview"
                className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200" 
              />
              <span className="text-xs text-gray-600">Preview: {getCurrentFile()?.name}</span> 
            </div>
          )}
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Họ" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
            <Input placeholder="Nhập họ" disabled={isPending} />
          </Form.Item>
          <Form.Item label="Tên" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Nhập tên" disabled={isPending} />
          </Form.Item>
        </div>

        <Form.Item label="Tên người dùng" name="userName" rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
          <Input placeholder="Nhập tên người dùng" disabled={isPending} />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
          <Input placeholder="Nhập email" disabled={isPending} />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
          <Input placeholder="Nhập số điện thoại" disabled={isPending} />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="userAddress" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ" disabled={isPending} />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="userDob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
          <DatePicker 
            style={{ width: '100%' }} 
            format="YYYY-MM-DD" 
            placeholder="Chọn ngày sinh" 
            disabled={isPending}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;