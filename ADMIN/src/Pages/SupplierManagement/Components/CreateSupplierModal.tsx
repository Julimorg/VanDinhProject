import React from 'react'; 
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateSupplier } from '../Hook/useCreateSupplier';
import { ICreateSupplierRequest } from '@/Interface/Supplier/ICreateSupplier';
import { toast } from 'react-toastify';
import { useUploadImgFile } from '@/Hook/useUploadImgFile';


interface CreateSupplierModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateSupplierModal: React.FC<CreateSupplierModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { mutate: createSupplier, isPending } = useCreateSupplier({
    onSuccess: () => {
      toast.success('Thêm nhà cung cấp thành công!');
      form.resetFields();
      upload.reset(); 
      onSuccess?.();
    },
  });

  // Sử dụng hook upload
  const upload = useUploadImgFile({
    maxSize: 2 * 1024 * 1024,
    maxCount: 1,
    listType: 'picture',
    onFileChange: (file) => {
      console.log('File thay đổi:', file); // Optional debug
    },
  });

  const handleSubmit = (values: any) => {
    const file = upload.getCurrentFile();
    if (!file) {
      message.error('Vui lòng chọn ảnh nhà cung cấp!');
      return;
    }

    const requestBody: ICreateSupplierRequest = {
      supplierName: values.supplierName,
      supplierAddress: values.supplierAddress,
      supplierPhone: values.supplierPhone,
      supplierEmail: values.supplierEmail,
      supplierImg: file,
    };

    console.log('Form values for create supplier:', requestBody);

    createSupplier(requestBody);
  };

  // Xóa useEffect reset → Tránh loop! Modal unmount tự clear state nhờ destroyOnClose
  // Nếu cần reset khi cancel (không success), thêm vào parent: onCancel={() => { upload.reset(); handleCloseModal(); }}

  return (
    <Modal
      title="Thêm nhà cung cấp mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose // Đảm bảo unmount clear state
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ supplierImg: [] }}
      >
        <Form.Item
          name="supplierName"
          label="Tên nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }]}
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
        </Form.Item>

        <Form.Item
          name="supplierAddress"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          name="supplierPhone"
          label="Điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 số)!' },
          ]}
        >
          <Input placeholder="Nhập số điện thoại (10-11 số)" />
        </Form.Item>

        <Form.Item
          name="supplierEmail"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="supplierImg"
          label="Ảnh nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng chọn ảnh nhà cung cấp!' }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e && e.fileList || []; // Fallback an toàn
          }}
        >
          <Upload {...upload.uploadProps}>
            <Button icon={<UploadOutlined />}>
              Chọn ảnh (JPG, PNG, GIF, BMP, WEBP - tối đa 2MB)
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end gap-2">
          <Button onClick={onCancel} disabled={isPending}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSupplierModal;