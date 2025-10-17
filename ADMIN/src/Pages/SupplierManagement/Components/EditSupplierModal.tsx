import React from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload';  
import { useUpdateSupplier } from '../Hook/useUpdateSupplier';
import { useUploadImgFile } from '@/Hook/useUploadImgFile'; 
import { toast } from 'react-toastify';
import { IUpdateSupplierRequest } from '@/Interface/Supplier/IUpdateSupplier';

type FormValues = {
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  supplierEmail: string;
};

interface EditSupplierModalProps {
  visible: boolean;
  onCancel: () => void;
  supplier: any; 
  onSuccess: () => void;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({ visible, onCancel, supplier, onSuccess }) => {
  const [form] = Form.useForm<FormValues>();  // Type form
  const supplierId = supplier?.supplierId; 

  const { uploadProps, getCurrentFile, reset } = useUploadImgFile({
    allowedTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
    maxCount: 1,
    listType: 'picture',
  });

  const { mutate: updateSupplier, isPending } = useUpdateSupplier(supplierId, {
    onSuccess: () => {
      toast.success('Cập nhật nhà cung cấp thành công!');
      form.resetFields();
      reset(); 
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Lỗi cập nhật nhà cung cấp: ${error.message}`);
    },
  });

  React.useEffect(() => {
    if (visible && supplier) {
      form.setFieldsValue({
        supplierName: supplier.supplierName,
        supplierAddress: supplier.supplierAddress,
        supplierPhone: supplier.supplierPhone,
        supplierEmail: supplier.supplierEmail,
    
      });
    }
  }, [visible, supplier, form]);

  const handleSubmit = (values: FormValues) => {  
    if (!supplier) return;


    const newFile = getCurrentFile();

    const body: IUpdateSupplierRequest = { 
      supplierName: values.supplierName,
      supplierAddress: values.supplierAddress,
      supplierPhone: values.supplierPhone,
      supplierEmail: values.supplierEmail,
      ...(newFile && { supplierImg: newFile }),  
    };

    updateSupplier(body);
  };

  return (
    <Modal
      title="Sửa thông tin nhà cung cấp"
      open={visible}
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
        <Form.Item name="supplierName" label="Tên nhà cung cấp" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="Nhập tên nhà cung cấp" />
        </Form.Item>

        <Form.Item name="supplierAddress" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item name="supplierPhone" label="Điện thoại" rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
        ]}>
          <Input placeholder="Nhập số điện thoại (10-11 số)" />
        </Form.Item>

        <Form.Item name="supplierEmail" label="Email" rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}>
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item label="Ảnh nhà cung cấp">
          {/* Upload component từ hook */}
          <Upload<UploadProps> {...uploadProps}>  
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
          {/* Fix: Optional chaining cho fileList */}
          {(uploadProps.fileList?.length === 0 || !uploadProps.fileList) && supplier?.supplierImg && (
            <div className="mt-2">
              <img src={supplier.supplierImg} alt="Current" className="w-20 h-20 rounded object-cover" />
              <p className="text-sm text-gray-500">Ảnh hiện tại</p>
            </div>
          )}
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end gap-2">
          <Button onClick={onCancel} disabled={isPending}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>Cập nhật</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSupplierModal;