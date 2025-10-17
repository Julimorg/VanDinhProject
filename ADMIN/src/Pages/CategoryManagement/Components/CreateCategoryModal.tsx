import React from 'react';
import { Modal, Form, Input, Upload, Button, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload';
import { useCreateCategory } from '../Hook/useCreateCategory';
import { ICreateCategoryRequest } from '@/Interface/Category/ICreateCategory';

interface CreateCategoryModalProps {
  open: boolean;
  onCancel: () => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ open, onCancel }) => {
  const [form] = Form.useForm();

  const { mutate: createCategory, isPending } = useCreateCategory({
    onSuccess: () => {
      message.success('Tạo danh mục thành công!');
      form.resetFields();
      onCancel();
    },
    onError: (err) => {
      message.error(`Lỗi tạo danh mục: ${err.message || 'Có lỗi xảy ra'}`);
    },
  });

  const handleOk = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
    const body: ICreateCategoryRequest = {
      categoryName: values.categoryName,
      categoryDescription: values.categoryDescription,
      categoryImage: (values.categoryImage?.[0] as any)?.originFileObj as File,
    };

    console.log('Tạo danh mục với dữ liệu:', body);
    createCategory(body);
  };

  
  const uploadProps: UploadProps = {
    name: 'categoryImage',
    listType: 'picture-card',
    maxCount: 1,
    beforeUpload: () => false, 
    onRemove: (file) => {
      console.log('Xóa ảnh:', file);
      return true;
    },
  };

  return (
    <Modal
      title="Thêm danh mục mới"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Tạo mới"
      cancelText="Hủy"
      centered
      destroyOnClose
      confirmLoading={isPending}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="categoryImage"
          label="Hình ảnh danh mục"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: 'Vui lòng chọn hình ảnh!' }]}
        >
          <Upload.Dragger
            name="categoryImage"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            accept="image/*"
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
              showDownloadIcon: false,
            }}
          >
            <p className="ant-upload-drag-icon">
              <PlusOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả ảnh vào đây hoặc bấm để chọn</p>
            <p className="ant-upload-hint">Chỉ chọn 1 ảnh (.jpg, .png, .jpeg)</p>
          </Upload.Dragger>
        </Form.Item>


        <Form.Item
          name="categoryName"
          label="Tên danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
        >
          <Input placeholder="Nhập tên danh mục (vd: Thức ăn, Đồ uống...)" />
        </Form.Item>

        <Form.Item
          name="categoryDescription"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả ngắn gọn về danh mục (vd: Các món ăn nhanh, món chính...)"
            rows={3}
            maxLength={300}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCategoryModal;
