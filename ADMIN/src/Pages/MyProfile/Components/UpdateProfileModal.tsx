import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Upload, 
  DatePicker,
  Button, 
  Space, 
  message, 
  Typography 
} from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { IGetMyProfileResponse } from '@/Interface/Users/IGetMyProfile';
import { useUpdateMyProfile } from '../Hook/userEditMyProfile';
import { IUdpateMyProfileRequest } from '@/Interface/Users/IUpdateMyProfile';
import { useAuthStore } from '@/Store/IAuth';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query'; 

interface FormValues {
  lastName: string; 
  firstName: string; 
  userName?: string;
  email: string;
  phone?: string;
  userAddress?: string;
  userDob?: dayjs.Dayjs | null;
}

interface UpdateProfileModalProps {
  visible: boolean;
  onCancel: () => void;
  initialData?: IGetMyProfileResponse;
  onUpdateSuccess: () => void;
  isTabletOrMobile: boolean;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  visible,
  onCancel,
  initialData,
  onUpdateSuccess,
  isTabletOrMobile,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const queryClient = useQueryClient(); 
  
  const userId = useAuthStore((state) => state.id);
  
  const mutation = useUpdateMyProfile(userId || '', {
    onSuccess: () => {
    //   console.log('Success response:', responseData); 
      message.success('Cập nhật hồ sơ thành công!');
 
      queryClient.invalidateQueries({ queryKey: ['myProfile', userId] });
      onUpdateSuccess();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ!';
      message.error(errorMessage);
    },
  });

  useEffect(() => {
    if (visible && initialData) {
      form.setFieldsValue({
        lastName: initialData.firstName || '', 
        firstName: initialData.lastName || '', 
        userName: initialData.userName,
        email: initialData.email,
        phone: initialData.phone,
        userAddress: initialData.userAddress,
        userDob: initialData.userDob ? dayjs(initialData.userDob) : null, 
      });
 
      if (initialData.userImg) {
        setFileList([{ 
          uid: '-1', 
          name: 'Ảnh cũ', 
          status: 'done' as const, 
          url: initialData.userImg,
        }]);
      } else {
        setFileList([]);
      }
    }
  }, [visible, initialData, form]);

  //? Đóng modal và reset
  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setFileList([]);
    mutation.reset(); 
  };

  //? Handle Form Update
  const handleUpdate = async (values: FormValues) => { 
    const body: IUdpateMyProfileRequest = {
      firstName: values.firstName?.trim() || undefined,
      lastName: values.lastName?.trim() || undefined, 
      userName: values.userName?.trim() || undefined,
      email: values.email,
      phone: values.phone?.trim() || undefined,
      userAddress: values.userAddress?.trim() || undefined,
      userDob: values.userDob ? values.userDob.format('YYYY-MM-DD') : undefined, 
      userImg: (fileList[0]?.originFileObj as File) || undefined,
    };

    console.log('Body gửi từ form:', body); 

    mutation.mutate(body);
  };

  //? Xử lý thay đổi fileList
  const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    const updatedList = newFileList.map((file) => {
      if (file.originFileObj && !file.url) {
        return { ...file, url: URL.createObjectURL(file.originFileObj) };
      }
      return file;
    });
    setFileList(updatedList);
  };

  //? Check định dạng file
  const beforeUpload = (file: RcFile) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type || '')) {
      message.error('Chỉ chấp nhận file ảnh: JPEG, JPG, PNG, GIF, BMP, WEBP!');
      return false;
    }
    if (file.size && file.size > 2 * 1024 * 1024) { 
      message.error('File quá lớn! Tối đa 2MB.');
      return false;
    }
    return true;
  };

  //? Validate date: Không cho ngày tương lai
  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current > dayjs(); 
  };

  return (
    <Modal 
      title="Cập Nhật Thông Tin Cá Nhân" 
      open={visible} 
      onCancel={handleCancel}
      footer={null}
      width={isTabletOrMobile ? '90%' : 600}
      centered
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleUpdate}
      >
        
        <Form.Item 
          name="lastName" 
          label="Họ" 
          rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
        >
          <Input placeholder="Nhập họ (ví dụ: Trần)" />
        </Form.Item>

        <Form.Item 
          name="firstName"
          label="Tên" 
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Nhập tên (ví dụ: Phong)" />
        </Form.Item>

        <Form.Item 
          name="userName" 
          label="Tên Đăng Nhập"
          rules={[
            { pattern: /^[a-zA-Z0-9_]{3,20}$/, message: 'Tên đăng nhập phải 3-20 ký tự, chỉ chữ cái, số và dấu gạch dưới!' }
          ]}
        >
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <Form.Item 
          name="email" 
          label="Email" 
          rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
        >
          <Input placeholder="Nhập email" disabled />
        </Form.Item>

        <Form.Item 
          name="phone" 
          label="Số Điện Thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' }, 
            { pattern: /^\d{10,11}$/, message: 'Số điện thoại phải là 10-11 chữ số!' }
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item 
          name="userAddress" 
          label="Địa Chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input.TextArea rows={2} placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item name="userDob" label="Ngày Sinh">
          <DatePicker 
            format="DD/MM/YYYY" 
            style={{ width: '100%' }} 
            placeholder="Chọn ngày sinh"
            disabledDate={disabledDate} 
          />
        </Form.Item>

        <Form.Item label="Ảnh Đại Diện">
          <Upload 
            name="avatar"
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            maxCount={1}
            beforeUpload={beforeUpload}
          >
            {fileList.length < 1 && (
              <div>
                <PlusOutlined />
                <div className="mt-2"><Typography.Text type="secondary">Chọn ảnh</Typography.Text></div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item className="text-center">
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={mutation.isPending}
              icon={<EditOutlined />}
            >
              Cập Nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProfileModal;