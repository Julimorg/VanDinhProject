import React from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload';


interface EditSupplierModalProps {
  visible: boolean;
  onCancel: () => void;
  supplier: any; // Dữ liệu supplier để edit
  onSuccess: () => void;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({ visible, onCancel, supplier, onSuccess }) => {
  const [form] = Form.useForm();
//   const { mutate: updateSupplier, isLoading } = useUpdateSupplier({
//     onSuccess: () => {
//       message.success('Cập nhật nhà cung cấp thành công!');
//       form.resetFields();
//       onSuccess();
//     },
//     onError: (error) => {
//       message.error(`Lỗi cập nhật nhà cung cấp: ${error.message}`);
//     },
//   });

  // Load dữ liệu vào form khi modal mở
  React.useEffect(() => {
    if (visible && supplier) {
      form.setFieldsValue({
        supplierId: supplier.supplierId,
        supplierName: supplier.supplierName,
        supplierAddress: supplier.supplierAddress,
        supplierPhone: supplier.supplierPhone,
        supplierEmail: supplier.supplierEmail,
        supplierImg: supplier.supplierImg,
      });
    }
  }, [visible, supplier, form]);

  // Props cho Upload (tương tự add)
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const url = URL.createObjectURL(file);
      form.setFieldsValue({ supplierImg: url });
      return false;
    },
    maxCount: 1,
    listType: 'picture',
    showUploadList: false,
  };

  const handleSubmit = (values: any) => {
    if (supplier) {
      updateSupplier({ id: supplier.supplierId, ...values });
    }
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
      <Form
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

        <Form.Item name="supplierImg" label="Ảnh nhà cung cấp" valuePropName="fileList" getValueFromEvent={(e) => {
          if (Array.isArray(e)) return e;
          return e?.fileList;
        }}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
          {supplier?.supplierImg && <img src={supplier.supplierImg} alt="Current" className="mt-2 w-20 h-20 rounded object-cover" />}
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end gap-2">
          {/* <Button onClick={onCancel} disabled={isLoading}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>Cập nhật</Button> */}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSupplierModal;