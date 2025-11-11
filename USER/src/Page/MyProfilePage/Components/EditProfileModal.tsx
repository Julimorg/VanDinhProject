import React, { useEffect } from 'react';
import { Button, Upload, Modal, message, Form, Input, DatePicker } from 'antd'; 
import { UploadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useUploadImgFile } from '../../../Hook/useUploadImgFile';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  userImg?: string;
  phone: string;
  userAddress: string;
  userDob: string; // YYYY-MM-DD
  status: string;
}

interface EditForm {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  userAddress: string;
  userDob: Dayjs; // Thay đổi thành Dayjs để tương thích với DatePicker
  userImg?: File; 
}

interface EditProfileModalProps {
  open: boolean; // Giữ nguyên, nhưng AntD dùng visible
  userData: UserData;
  onSave: (updatedData: Partial<UserData>) => void;
  onCancel: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, userData, onSave, onCancel }) => {
  // Sử dụng AntD Form để quản lý form state (thay vì useState thủ công)
  const [form] = Form.useForm<EditForm>();

  // Hook upload ảnh - thay listType thành 'picture' cho vuông
  const { uploadProps, getCurrentFile, reset } = useUploadImgFile({
    maxSize: 2 * 1024 * 1024, // 2MB
    maxCount: 1,
    onFileChange: (file: File | null) => {
      if (file) {
        form.setFieldsValue({ userImg: file }); // Cập nhật form field
        message.success('File ảnh đã được chọn!');
      } else {
        form.setFieldsValue({ userImg: undefined });
      }
    },
    listType: 'picture', // Vuông thay vì tròn
  });

  // Khởi tạo form khi mở modal
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        phone: userData.phone,
        userAddress: userData.userAddress,
        userDob: dayjs(userData.userDob), // Chuyển string sang Dayjs
        userImg: undefined, // Reset file
      });
      reset(); // Reset upload hook
    }
  }, [open, userData, form, reset]);

  // Hàm mock upload file (thay bằng API thực tế)
  const uploadAvatarFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      // Mock: Thay bằng await axios.post('/api/upload-avatar', formData)
      console.log('Uploading file:', file.name);
      // Giả sử API trả về { url: 'new-avatar-url' }
      const mockUrl = URL.createObjectURL(file); // Tạm thời
      return mockUrl;
    } catch (error) {
      message.error('Lỗi upload ảnh đại diện!');
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // Validate form

      let newAvatarUrl: string = userData.userImg || '';

      // Nếu có file mới, upload
      if (values.userImg) {
        try {
          newAvatarUrl = await uploadAvatarFile(values.userImg);
        } catch (error) {
          return; // Dừng nếu lỗi
        }
      }

      // Gọi callback để cập nhật parent
      onSave({
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.userName,
        email: values.email,
        phone: values.phone,
        userAddress: values.userAddress,
        userDob: values.userDob.format('YYYY-MM-DD'), // Chuyển Dayjs sang string
        userImg: newAvatarUrl,
      });

      message.success('Cập nhật thông tin thành công!');
      onCancel(); // Đóng modal
    } catch (error) {
      message.error('Vui lòng kiểm tra thông tin!');
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form
    onCancel();
  };

  if (!open) return null;

  return (
    <Modal
      title="Chỉnh sửa thông tin cá nhân"
      open={open}
      onCancel={handleCancel}
      onOk={handleSave} // Sử dụng onOk của AntD, nhưng custom footer để linh hoạt
      footer={[
        <Button key="cancel" size="large" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="save" type="primary" size="large" onClick={handleSave}>
          Lưu thay đổi
        </Button>,
      ]}
      width={800} // Rộng hơn cho form
      destroyOnClose // Cleanup khi đóng
      maskClosable={false} // Không đóng khi click backdrop
    >
      <Form form={form} layout="vertical" className="space-y-4">
        {/* Phần upload avatar - chữ nhỏ hơn, preview nhỏ hơn, vuông */}
        <Form.Item label={<span className="text-sm">Ảnh đại diện (JPG, PNG, max 2MB)</span>} name="userImg">
          <Upload
            {...uploadProps}
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
          >
            <Button icon={<UploadOutlined />} size="small">Chọn ảnh</Button> {/* Button nhỏ hơn */}
          </Upload>
          {getCurrentFile() && (
            <div className="mt-2 flex items-center gap-2">
              <img
                src={URL.createObjectURL(getCurrentFile()!)}
                alt="Avatar preview"
                className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200" 
              />
              <span className="text-xs text-gray-600">Preview: {getCurrentFile()?.name}</span> {/* Chữ nhỏ hơn */}
            </div>
          )}
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Họ" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
            <Input placeholder="Nhập họ" />
          </Form.Item>
          <Form.Item label="Tên" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Nhập tên" />
          </Form.Item>
        </div>

        <Form.Item label="Tên người dùng" name="userName" rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="userAddress" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="userDob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
          <DatePicker 
            style={{ width: '100%' }} 
            format="YYYY-MM-DD" 
            placeholder="Chọn ngày sinh" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;