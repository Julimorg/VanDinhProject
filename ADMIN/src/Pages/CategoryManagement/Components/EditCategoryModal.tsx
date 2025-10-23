import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Button, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { useUpdateCategory } from '../Hook/useEditCategory';
import type { IUpdateCategoryRequest } from '@/Interface/Category/IUpdateCategory';
import { useUploadImgFile } from '@/Hook/useUploadImgFile';
import { toast } from 'react-toastify';

type FormValues = {
  categoryName: string;
  categoryDescription: string;
};

interface EditCategoryModalProps {
  open: boolean;
  categoryId: string;
  initialData: {
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;
  } | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  open,
  categoryId,
  initialData,
  onCancel,
  onSuccess,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();

  const { uploadProps, getCurrentFile, reset } = useUploadImgFile({
    allowedTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
    maxCount: 1,
    listType: 'picture',
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [initialSelected, setInitialSelected] = useState<boolean>(false);

  const { mutate: updateCategory, isPending } = useUpdateCategory(categoryId, {
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công!');
      form.resetFields();
      reset();
      setFileList([]);
      setInitialSelected(false);
      onCancel();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Lỗi cập nhật danh mục: ${error.message}`);
    },
  });

  // khi mở modal: set form + hiển thị ảnh cũ trong fileList
  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        categoryName: initialData.categoryName,
        categoryDescription: initialData.categoryDescription,
      });

      if (initialData.categoryImage) {
        setFileList([
          {
            uid: '-1',
            name: 'current-image',
            status: 'done',
            url: initialData.categoryImage,
          },
        ]);
        setInitialSelected(true); 
      } else {
        setFileList([]);
        setInitialSelected(false);
      }
    } else {
      
      setFileList([]);
      setInitialSelected(false);
      form.resetFields();
      reset();
    }
    
  }, [open, initialData]);

  const handleUploadChange: UploadProps['onChange'] = ({ file, fileList: newList }) => {
    setFileList(newList);

    if (newList.length === 0) {
      setInitialSelected(false);
    } else {
      const hasOriginFile = newList.some((f) => !!(f as UploadFile).originFileObj);
      if (hasOriginFile) {
        setInitialSelected(false);
      }
    }

    if (uploadProps.onChange) {
      uploadProps.onChange({ file, fileList: newList } as any);
    }
  };

  const handleSubmit = (values: FormValues) => {
  if (!initialData) return;

  const newFile = getCurrentFile();

  const body: IUpdateCategoryRequest = {
    categoryName: values.categoryName,
    categoryDescription: values.categoryDescription,
  };

  if (newFile && newFile instanceof File) {
    body.categoryImage = newFile;
  }

  updateCategory(body);
};

  return (
    <Modal
      title="Chỉnh sửa Danh mục"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên danh mục"
          name="categoryName"
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { min: 3, message: 'Tên danh mục phải có ít nhất 3 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tên danh mục..." size="large" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="categoryDescription"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả danh mục..."
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item label="Ảnh danh mục">
          {/* truyền fileList và onChange local để hiển thị ảnh cũ và đồng bộ */}
          <Upload<UploadProps>
            {...uploadProps}
            fileList={fileList}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />} size="large">
              Chọn ảnh mới
            </Button>
          </Upload>

          {/* nếu ảnh cũ tồn tại và user không chọn file mới, hiển thị thông báo */}
          {fileList.length === 0 && initialData?.categoryImage && (
            <div className="mt-2">
              <img
                src={initialData.categoryImage}
                alt="Current"
                className="w-20 h-20 rounded object-cover"
              />
              <p className="text-sm text-gray-500">Ảnh hiện tại</p>
            </div>
          )}
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end gap-2">
          <Button onClick={onCancel} disabled={isPending}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
