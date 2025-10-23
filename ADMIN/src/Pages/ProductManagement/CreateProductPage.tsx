import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Upload,
  message,
  InputNumber,
  Typography,
  Space,
  Alert,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Thêm import useNavigate
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import type { RcFile } from 'antd/es/upload/interface';
import SupplierSelector from './Components/SupplierSelector'; // Import component mới
import CategorySelector from './Components/CategorySelector'; // Import component mới

const { Title } = Typography;
const { TextArea } = Input;

// Interface cho form data
interface ProductFormData {
  productName: string;
  productDescription: string;
  productImage: File[];
  productVolume: string;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  discount: number;
  productPrice: number;
  supplierId: string;
  color: string;
  categoryId: string;
}

// Props cho component (tùy chọn)
interface CreateProductProps {
  onSubmit?: (values: ProductFormData) => void;
  onCancel?: () => void;
  suppliers?: string[]; // Giả sử danh sách supplier IDs
  categories?: string[]; // Giả sử danh sách category IDs
  colors?: string[]; 
}

const CreateProductPage: React.FC<CreateProductProps> = ({
  onSubmit,
  onCancel,
  suppliers = [],
  categories = [],
  colors = [],
}) => {
  const navigate = useNavigate(); // Thêm hook navigate
  const [form] = Form.useForm<ProductFormData>();
  const [loading, setLoading] = useState(false);
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);

  // Xử lý upload ảnh
  const handleImageUpload = ({ fileList }: UploadChangeParam<UploadFile>) => {
    setImageFileList(fileList);
  };

  // Kiểm tra kích thước file (<= 2MB)
  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isLt2M;
  };

  // Xử lý submit form
  const onFinish = async (values: ProductFormData) => {
    setLoading(true);
    try {
      // Kiểm tra file ảnh
      if (imageFileList.length === 0) {
        message.error('Vui lòng chọn ít nhất một ảnh sản phẩm!');
        return;
      }

      const submitData: ProductFormData = {
        ...values,
        productImage: imageFileList.map((file) => file.originFileObj as File),
      };

      // Gọi callback submit
      onSubmit?.(submitData);
      message.success('Tạo sản phẩm thành công!');
      form.resetFields();
      setImageFileList([]);
    } catch (error) {
      message.error('Tạo sản phẩm thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý hủy: Quay về trang trước và gọi onCancel nếu có
  const handleCancel = () => {
    form.resetFields();
    setImageFileList([]);
    onCancel?.(); // Callback nếu cần (ví dụ: refetch ở parent)
    navigate(-1); // Quay về trang trước (page cũ)
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <Space className="mb-6 w-full flex justify-between items-center">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          className="block sm:block" // Hiển thị luôn trên mobile/tablet
        >
          Quay lại
        </Button>
        <Title level={2} className="m-0 flex-1 text-center">
          Tạo Sản Phẩm Mới
        </Title>
        <div className="w-8" /> {/* Spacer cho responsive */}
      </Space>

      {/* Form Card */}
      <Card className="max-w-4xl mx-auto">
        <Alert
          message="Thông tin bắt buộc"
          description="Các trường có dấu * là bắt buộc. Ảnh sản phẩm phải ≤ 2MB."
          type="info"
          showIcon
          className="mb-6"
        />

        <Form
          form={form}
          name="createProduct"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          disabled={loading}
        >
          {/* Row 1: Tên và Mã sản phẩm */}
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="productName"
                label="Tên sản phẩm *"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item 
                name="productCode" 
                label="Mã sản phẩm *"
                rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]} // Thêm required nếu cần
              >
                <Input placeholder="Nhập mã sản phẩm" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: Mô tả */}
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="productDescription"
                label="Mô tả sản phẩm *"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: Ảnh sản phẩm */}
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="productImage"
                label="Ảnh sản phẩm *"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload
                  listType="picture-card"
                  fileList={imageFileList}
                  onChange={handleImageUpload}
                  beforeUpload={beforeUpload}
                  maxCount={5} // Tối đa 5 ảnh
                  accept="image/*"
                >
                  {imageFileList.length < 5 && (
                    <div>
                      <PlusOutlined />
                      <div className="mt-2">Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 4: Dung lượng, Đơn vị, Màu sắc */}
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="productVolume" label="Dung lượng">
                <Input placeholder="Ví dụ: 500ml" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="productUnit" label="Đơn vị">
                <Input placeholder="Ví dụ: ml, cái, kg" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="color" label="Màu sắc">
                <Input placeholder="Nhập màu sắc (ví dụ: đỏ, xanh)" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 5: Số lượng, Giá, Giảm giá */}
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="productQuantity"
                label="Số lượng *"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  min={0}
                  placeholder="0"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="productPrice"
                label="Giá sản phẩm *"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  placeholder="0"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="discount" label="Giảm giá (%)">
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="0"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 6: Nhà cung cấp và Danh mục - Sử dụng hai component riêng */}
          <Row gutter={16}>
            <SupplierSelector 
              form={form}
              suppliers={suppliers}
            />
            <CategorySelector 
              form={form}
              categories={categories}
            />
          </Row>

          {/* Buttons */}
          <Row gutter={16} justify="end">
            <Col>
              <Space>
                <Button onClick={handleCancel} icon={<UploadOutlined />}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  loading={loading}
                >
                  Tạo Sản Phẩm
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateProductPage;