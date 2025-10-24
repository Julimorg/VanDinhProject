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
  Divider,
} from 'antd';
import {
  PlusOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import type { RcFile } from 'antd/es/upload/interface';
import SupplierSelector from './Components/SupplierSelector';
import CategorySelector from './Components/CategorySelector';
import { useCreateProduct } from './Hook/useCreateProduct';
import { toast } from 'react-toastify';
import { parseCurrency } from '@/Utils/ulti';

const { Title } = Typography;
const { TextArea } = Input;


interface ProductFormData {
  productName: string;
  productDescription: string;
  productImage: File[];
  productVolume: string;
  productUnit: string;
  productCode: string;
  productQuantity: number;
  discount?: number; 
  productPrice: number;
  supplierId: string;
  colorId: string;
  categoryId: string;
}

interface CreateProductProps {
  onSubmit?: (values: ProductFormData) => void;
  onCancel?: () => void;
}

const CreateProductPage: React.FC<CreateProductProps> = ({
  onSubmit,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<ProductFormData>();
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct({
    onSuccess: (response) => {
      toast.success('Tạo sản phẩm thành công!');
      form.resetFields();
      setImageFileList([]);
      onSubmit?.(response.data); 
      navigate(-1); 
    },
    onError: (error) => {
      toast.error(`Tạo sản phẩm thất bại! Vui lòng thử lại. - ${error}`);
      // console.error('Create product error:', error); 
    },
  });

  //?  Xử lý upload ảnh
  const handleImageUpload = ({ fileList }: UploadChangeParam<UploadFile>) => {
    setImageFileList(fileList);
  };

  //? Kiểm tra kích thước file (<= 2MB)
  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isLt2M;
  };

  const onFinish = async (values: ProductFormData) => {
    // Kiểm tra file ảnh
    if (imageFileList.length === 0) {
      message.error('Vui lòng chọn ít nhất một ảnh sản phẩm!');
      return;
    }

    const submitData: ProductFormData = {
      ...values,
      productImage: imageFileList.map((file) => file.originFileObj as File),
    };

    createProduct(submitData);
  };

  //? Xử lý hủy: Quay về trang trước và gọi onCancel nếu có
  const handleCancel = () => {
    form.resetFields();
    setImageFileList([]);
    onCancel?.();
    navigate(-1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <Space className="mb-8 w-full flex justify-between items-center">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          size="large"
          className="shadow-sm"
          disabled={isCreating}
        >
          Quay lại
        </Button>
        <Title level={2} className="m-0 flex-1 text-center text-gray-800">
          Tạo Sản Phẩm Mới
        </Title>
        <div className="w-10" /> 
      </Space>

      {/* Form Card */}
      <Card className="max-w-5xl mx-auto shadow-lg" bordered={false}>
        <Alert
          message="Thông tin bắt buộc"
          description="Các trường có dấu * là bắt buộc. Ảnh sản phẩm phải ≤ 2MB và tối đa 5 ảnh."
          type="info"
          showIcon
          className="mb-6 rounded-md"
        />

        <Form
          form={form}
          name="createProduct"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          disabled={isCreating}
        >
          {/* Section 1: Thông tin cơ bản */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Thông tin cơ bản</Title>
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="productName"
                  label="Tên sản phẩm *"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                  <Input placeholder="Nhập tên sản phẩm đầy đủ" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="productCode"
                  label="Mã sản phẩm *"
                  rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}
                >
                  <Input placeholder="Nhập mã sản phẩm duy nhất" className="rounded-md" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item
                  name="productDescription"
                  label="Mô tả sản phẩm *"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập mô tả chi tiết sản phẩm, bao gồm tính năng nổi bật..."
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider className="my-8" />

          {/* Section 2: Hình ảnh sản phẩm */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Hình ảnh sản phẩm</Title>
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item
                  name="productImage"
                  label="Ảnh sản phẩm *"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e;
                    return e?.fileList;
                  }}
                  rules={[{ required: true, message: 'Vui lòng chọn ảnh sản phẩm!' }]}
                >
                  <Upload
                    listType="picture-card"
                    fileList={imageFileList}
                    onChange={handleImageUpload}
                    beforeUpload={beforeUpload}
                    maxCount={5}
                    accept="image/*"
                    className="rounded-md"
                  >
                    {imageFileList.length < 5 && (
                      <div className="flex flex-col items-center">
                        <PlusOutlined className="text-lg" />
                        <div className="mt-2 text-sm text-gray-600">Thêm ảnh</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider className="my-8" />

          {/* Section 3: Chi tiết sản phẩm (bỏ field Màu sắc thủ công) */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Chi tiết sản phẩm</Title>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item name="productVolume" label="Dung lượng">
                  <Input placeholder="Ví dụ: 500ml" className="rounded-md" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="productUnit" label="Đơn vị">
                  <Input placeholder="Ví dụ: chai, hộp" className="rounded-md" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider className="my-8" />

          {/* Section 4: Giá cả và kho hàng */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Giá cả và kho hàng</Title>
            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="productQuantity"
                  label="Số lượng tồn kho *"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                  <InputNumber
                    min={0}
                    placeholder="0"
                    style={{ width: '100%' }}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="productPrice"
                  label="Giá bán *"
                  rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                  <InputNumber
                    min={0}
                    precision={0}
                    placeholder="0"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={parseCurrency} 
                    style={{ width: '100%' }}
                    className="rounded-md"
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
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider className="my-8" />

          {/* Section 5: Phân loại */}
          <div className="mb-8">
            <Title level={4} className="mb-4 text-gray-700">Phân loại sản phẩm</Title>
            <Row gutter={24}>
              <SupplierSelector form={form} /> 
              <CategorySelector form={form} /> 
            </Row>
          </div>

          {/* Buttons */}
          <Divider className="my-8" />
          <Row gutter={16} justify="end">
            <Col>
              <Space>
                <Button
                  onClick={handleCancel}
                  icon={<CloseOutlined />}
                  size="large"
                  className="shadow-sm"
                  disabled={isCreating}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  loading={isCreating}
                  size="large"
                  className="shadow-sm"
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