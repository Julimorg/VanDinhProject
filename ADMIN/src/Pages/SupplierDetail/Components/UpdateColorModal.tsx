import React, { useEffect, useRef } from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import type { IGetAllColor } from '@/Interface/Color/IGetAllColor';
import TextArea from 'antd/es/input/TextArea';
import { useUploadImgFile } from '@/Hook/useUploadImgFile';
import { QueryKeys } from '@/Constant/query-key';
import { toast } from 'react-toastify';
import { useUpdateColor } from '../hooks/useUpdateColor';

interface EditColorModalProps {
  visible: boolean;
  onCancel: () => void;
  color: IGetAllColor | undefined;
  onSuccess?: () => void;
}

const EditColorModal: React.FC<EditColorModalProps> = ({
  visible,
  onCancel,
  color,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const imageUpload = useUploadImgFile({ maxCount: 1 });
  const prevVisibleRef = useRef<boolean>(false);
  const queryClient = useQueryClient();

  const { mutate: updateColor, isPending: isUpdating } = useUpdateColor(
    color?.colorId || '',
    {
      onSuccess: () => {
        toast.success('Cập nhật mã màu thành công!');
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_COLOR_BY_SUPPLIER] });
        form.resetFields();
        imageUpload.reset();
        onSuccess?.();
        onCancel();
      },
      onError: (error) => {
        toast.error(`Lỗi khi cập nhật màu: ${error}`);
      },
    }
  );

  useEffect(() => {
    if (!prevVisibleRef.current && visible && color) {
      form.setFieldsValue({
        colorId: color.colorId,
        colorName: color.colorName,
        colorCode: color.colorCode,
        colorDescription: color.colorDescription,
      });
      imageUpload.reset();
    }
    prevVisibleRef.current = visible;
  }, [visible, color, form, imageUpload]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const file = imageUpload.getCurrentFile();
      const updateFile = file || new File([''], 'no-change.jpg', { type: 'image/jpeg' });
      updateColor({
        colorName: values.colorName,
        colorCode: values.colorCode,
        colorDescription: values.colorDescription,
        colorImg: updateFile,
      });
    } catch (info) {
      toast.warn(`Validate Failed: ${info}`);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa mã màu"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={isUpdating}
      okButtonProps={{ disabled: isUpdating }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="colorName"
          label="Tên màu"
          rules={[{ required: true, message: 'Vui lòng nhập tên màu!' }]}
        >
          <Input placeholder="Nhập tên màu" />
        </Form.Item>
        <Form.Item
          name="colorCode"
          label="Mã màu"
          rules={[{ required: true, message: 'Vui lòng nhập mã màu!' }]}
        >
          <Input placeholder="Nhập mã màu (ví dụ: #FF0000)" />
        </Form.Item>
        <Form.Item
          name="colorDescription"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <TextArea rows={3} placeholder="Nhập mô tả màu" />
        </Form.Item>
        <Form.Item label="Hình ảnh màu">
          <Upload {...imageUpload.uploadProps}>
            <Button icon={<UploadOutlined />}>Chọn file hình ảnh mới (tùy chọn)</Button>
          </Upload>
          {color?.colorImg && (
            <div style={{ marginTop: 8 }}>
              Hình ảnh hiện tại: <img src={color.colorImg} alt={color.colorName} style={{ width: '50px', height: '50px', marginLeft: 8 }} />
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditColorModal;