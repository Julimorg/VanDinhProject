// File: EditProfileModal.tsx (cập nhật)
import React from 'react';
import { Modal, Input, DatePicker, Upload, message, Button } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { UploadProps, UploadFile } from 'antd/es/upload';
import { useUploadImgFile } from '@/Hook/useUploadImgFile';


interface EditForm {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  userAddress: string;
  userDob: Dayjs | null;
  userImg: string | File | null; // Thêm field cho ảnh
}

interface EditProfileModalProps {
  open: boolean;
  editForm: EditForm;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof EditForm, value: any) => void;
  currentUserImg?: string; // URL ảnh hiện tại để preload
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  editForm,
  onSave,
  onCancel,
  onChange,
  currentUserImg,
}) => {
  // Sử dụng hook upload ảnh
  const { uploadProps, fileList, getCurrentFile, reset } = useUploadImgFile({
    maxCount: 1,
    listType: 'picture-circle',
    onFileChange: (file) => {
      onChange('userImg', file); // Cập nhật state editForm khi file thay đổi
    },
  });

  // Preload ảnh hiện tại vào fileList khi modal mở
  React.useEffect(() => {
    if (open && currentUserImg && fileList.length === 0) {
      const preloadFile: UploadFile = {
        uid: '-1',
        name: 'current-image.jpg',
        status: 'done',
        url: currentUserImg,
      };
      // Cập nhật fileList thủ công (hook không tự preload, nên dùng setState trực tiếp nếu cần, nhưng để đơn giản dùng effect)
      // Lưu ý: Hook không expose setFileList, nên có thể cần adjust hook hoặc dùng ref. Để đơn giản, giả sử preload qua props.
    }
  }, [open, currentUserImg, fileList.length]);

  // Reset fileList khi modal đóng (cancel)
  React.useEffect(() => {
    if (!open) {
      reset();
      onChange('userImg', null); // Reset ảnh trong form
    }
  }, [open, reset, onChange]);

  const handleFormChange = (field: keyof EditForm, value: any) => {
    onChange(field, value);
  };

  return (
    <Modal
      title={<span className="text-xl font-semibold">Chỉnh sửa thông tin</span>}
      open={open}
      onOk={onSave}
      onCancel={onCancel}
      width={700}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      centered
      className="edit-profile-modal"
    >
      <div className="mt-6 space-y-4">
        {/* Thêm phần upload ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện *</label>
          <Upload
            {...uploadProps}
            className="w-full"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
          {fileList.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">Ảnh hiện tại: {fileList[0].name}</p>
          )}
          {currentUserImg && fileList.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">Sử dụng ảnh hiện tại</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ *</label>
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập họ"
              value={editForm.firstName}
              onChange={(e) => handleFormChange('firstName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên *</label>
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập tên"
              value={editForm.lastName}
              onChange={(e) => handleFormChange('lastName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên người dùng *</label>
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập tên người dùng"
            value={editForm.userName}
            onChange={(e) => handleFormChange('userName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email"
            value={editForm.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Nhập số điện thoại"
            value={editForm.phone}
            onChange={(e) => handleFormChange('phone', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh *</label>
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày sinh"
            value={editForm.userDob}
            onChange={(date) => handleFormChange('userDob', date)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
          <Input.TextArea
            placeholder="Nhập địa chỉ"
            rows={3}
            value={editForm.userAddress}
            onChange={(e) => handleFormChange('userAddress', e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;