import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button, message, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { IGetAllProductResponse } from '@/Interface/Product/IGetAllProducts';
import { useUpdateProductQuantity } from '../Hook/useUpdateProductQuantity';
import { toast } from 'react-toastify';

interface EditQuantityModalProps {
    visible: boolean;
    onCancel: () => void;
    product: IGetAllProductResponse | null;
    onSuccess: () => void;
}

const UpdateProductQuantityModal: React.FC<EditQuantityModalProps> = ({
    visible,
    onCancel,
    product,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && product) {
            form.setFieldsValue({
                quantity: product.productQuantity,
            });
        }
    }, [visible, product, form]);

    const { mutate: updateQuantity } = useUpdateProductQuantity(
        product?.productId ?? '',
        {
            onSuccess: () => {
                setLoading(false);
                toast.success('Cập nhật số lượng thành công!');
                onSuccess();
                handleClose();
            },
            onError: (error: any) => {
                setLoading(false);
                toast.error(error?.message || 'Cập nhật thất bại!');
            },
        }
    );

    const handleSubmit = (values: { quantity: number }) => {
        if (!product) {
            return;
        }

        setLoading(true);
        updateQuantity({
            productQuantity: values.quantity,
        });
    };


    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <Space>
                    <EditOutlined />
                    <span>Chỉnh sửa số lượng sản phẩm</span>
                </Space>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={500}
            destroyOnClose
        >
            <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-1">Sản phẩm:</p>
                <p className="font-semibold text-base">{product?.productName}</p>
                <p className="text-sm text-gray-500 mt-1">
                    Số lượng hiện tại: <span className="font-medium">{product?.productQuantity}</span>
                </p>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    name="quantity"
                    label="Số lượng mới"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số lượng!' },
                        { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0!' },
                    ]}
                >
                    <InputNumber<number>
                        className="w-full"
                        placeholder="Nhập số lượng mới"
                        size="large"
                        min={0}
                        formatter={(value) =>
                            value !== undefined
                                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : ''
                        }
                        parser={(value) => {
                            const parsed = value ? Number(value.replace(/,/g, '')) : 0;
                            return parsed < 0 ? 0 : parsed;
                        }}
                    />
                </Form.Item>

                <Form.Item className="mb-0 mt-6">
                    <Space className="w-full justify-end">
                        <Button onClick={handleClose} size="large">
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            icon={<EditOutlined />}
                        >
                            Cập nhật
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateProductQuantityModal;