import React, { useMemo, useState } from 'react';
import {
    Card, Form, Input, Button, Select, message, InputNumber, Row, Col,
    Tag, Typography, Divider, Table
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined, ShoppingCartOutlined, UserOutlined,
    EnvironmentOutlined, CreditCardOutlined
} from '@ant-design/icons';
import { useCreateOrder } from './Hook/useCreateOrder';
import { useGetUserSelections } from './Hook/useGetUserSelection';
import { useGetProductSelections } from './Hook/useGetProductSelection';
import { ICreateOrderRequest } from '@/Interface/Order/ICreateOrder';
import { useAuthStore } from '@/Store/IAuth';
import { useDebounce } from "@/Hook/useDebounce";
import { toast } from "react-toastify";


const { Title, Text } = Typography;

const CreateOrderPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const adminUserId = useAuthStore((state) => state.id) ?? '';

    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});

    const { mutate: createOrder, isPending } = useCreateOrder({
        onSuccess: () => {
            toast.success('Tạo đơn hàng thành công!');
            form.resetFields();
            setSelectedProducts({});
            navigate('/orders', { state: { refresh: true } }); 
        },
        onError: (err: any) => {
            toast.error(`Tạo đơn hàng thất bại: ${err?.message ?? err}`);
        },
    });

    const [searchKeyword, setSearchKeyword] = useState('');
    const debouncedKeyword = useDebounce(searchKeyword, 400);
    const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>(undefined);
    const { data: userSelection } = useGetUserSelections();
    const { data: productSelection, isFetching } = useGetProductSelections({
        keyword: debouncedKeyword,
        supplierName: selectedSupplier,
    });

    const handleQuantityChange = (productId: string, qty: number | null) => {
        const safeQty = Math.max(1, qty ?? 1);
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: safeQty,
        }));
    };

    const handleCheck = (checked: boolean, productId: string) => {
        setSelectedProducts((prev) => {
            const newState = { ...prev };
            if (checked) newState[productId] = 1;
            else delete newState[productId];
            return newState;
        });
    };

    const columns = [
        {
            title: 'ID Sản phẩm',
            dataIndex: 'productId',
            key: 'productId',
            width: 150,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'supplierName',
            key: 'supplierName',
            render: (text: string) => text || <Tag color="default">Không có</Tag>,
        },
        {
            title: 'Tồn kho',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
            render: (num: number) => <Tag color="blue">{num}</Tag>,
            width: 120,
            align: 'center' as const,
        },
        {
            title: 'Giá',
            dataIndex: 'productPrice',
            key: 'productPrice',
            render: (p: any) => {
                const price = Number(p ?? 0);
                return <Text>{price.toLocaleString('vi-VN')} ₫</Text>;
            },
            width: 120,
            align: 'right' as const,
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center' as const,
            width: 200,
            render: (_: any, record: any) => {
                const isChecked = record.productId in selectedProducts;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleCheck(e.target.checked, record.productId)}
                        />
                        {isChecked && (
                            <InputNumber
                                min={1}
                                max={record.productQuantity}
                                value={selectedProducts[record.productId]}
                                onChange={(v) => handleQuantityChange(record.productId, v)}
                                style={{ width: 80 }}
                            />
                        )}
                    </div>
                );
            },
        },
    ];

    const handleSubmit = (values: any) => {
        const selectedIds = Object.keys(selectedProducts);
        if (selectedIds.length === 0) {
            message.warning('Vui lòng chọn ít nhất 1 sản phẩm!');
            return;
        }
        if (!values.userId) {
            message.error('Vui lòng chọn khách hàng!');
            return;
        }

        const requestBody: ICreateOrderRequest = {
            id: values.userId,
            shipAddress: values.shipAddress,
            paymentMethod: values.paymentMethod,
            orderItems: selectedIds.map((id) => ({
                productId: id,
                quantity: selectedProducts[id],
            })),
        };

        createOrder({
            userId: adminUserId,
            body: requestBody,
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            padding: '16px 16px 24px'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '20px' }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/orders')}
                        size="large"
                        style={{ marginBottom: '12px' }}
                    >
                        Quay lại
                    </Button>

                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '12px'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <ShoppingCartOutlined style={{ fontSize: '48px', color: '#fff', marginBottom: '8px' }} />
                            <Title level={2} style={{ color: '#fff', margin: 0 }}>
                                Tạo đơn hàng mới
                            </Title>
                            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                Chọn khách hàng và sản phẩm để tạo đơn hàng
                            </Text>
                        </div>
                    </Card>
                </div>

                <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark="optional"
                    >
                        {/* Khách hàng */}
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={5} style={{ marginBottom: '16px', color: '#1890ff' }}>
                                <UserOutlined /> Thông tin khách hàng
                            </Title>
                            <Form.Item
                                name="userId"
                                label="Chọn khách hàng"
                                rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
                            >
                                <Select
                                    size="large"
                                    placeholder="Tìm và chọn khách hàng"
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={
                                        userSelection?.data?.map((u: any) => ({
                                            label: `${u.firstName} ${u.lastName} (${u.userName})`,
                                            value: u.id,
                                        })) ?? []
                                    }
                                />
                            </Form.Item>
                        </div>

                        <Divider />

                        {/* Bảng sản phẩm */}
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={5} style={{ marginBottom: '16px', color: '#52c41a' }}>
                                <ShoppingCartOutlined /> Danh sách sản phẩm
                            </Title>
                            {/* Bộ lọc sản phẩm */}
                            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                                <Col xs={24} sm={16}>
                                    <Input
                                        placeholder="Tìm sản phẩm theo tên hoặc mã..."
                                        allowClear
                                        size="large"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </Col>

                                <Col xs={24} sm={8}>
                                    <Select
                                        allowClear
                                        size="large"
                                        placeholder="Lọc theo nhà cung cấp"
                                        value={selectedSupplier}
                                        onChange={(value) => setSelectedSupplier(value)}
                                        style={{ width: '100%' }}
                                        options={[
                                            ...Array.from(
                                                new Set(productSelection?.data?.map((p: any) => p.supplierName).filter(Boolean))
                                            ).map((name) => ({
                                                label: name,
                                                value: name,
                                            })),
                                        ]}
                                    />
                                </Col>
                            </Row>

                            <Table
                                columns={columns}
                                dataSource={productSelection?.data ?? []}
                                rowKey="productId"
                                pagination={{ pageSize: 5 }}
                                bordered
                                loading={isFetching}
                            />
                        </div>

                        <Divider />

                        {/* Địa chỉ giao hàng */}
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={5} style={{ marginBottom: '16px', color: '#fa8c16' }}>
                                <EnvironmentOutlined /> Thông tin giao hàng
                            </Title>

                            <Form.Item
                                name="shipAddress"
                                label="Địa chỉ giao hàng"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input.TextArea
                                    size="large"
                                    placeholder="VD: 123 Nguyễn Trãi, Quận 1, TP.HCM"
                                    rows={3}
                                    showCount
                                    maxLength={200}
                                />
                            </Form.Item>
                        </div>

                        <Divider />

                        {/* Thanh toán */}
                        <div style={{ marginBottom: '32px' }}>
                            <Title level={5} style={{ marginBottom: '16px', color: '#eb2f96' }}>
                                <CreditCardOutlined /> Phương thức thanh toán
                            </Title>

                            <Form.Item
                                name="paymentMethod"
                                label="Chọn phương thức"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                            >
                                <Select
                                    size="large"
                                    placeholder="Chọn phương thức thanh toán"
                                    options={[
                                        { label: '💵 Tiền mặt (COD)', value: 'CASH' },
                                        { label: '🏦 VNPAY', value: 'VN_PAY' },
                                        { label: '💳 PAYPAL', value: 'PAY_PAL' },
                                    ]}
                                />
                            </Form.Item>
                        </div>

                        {/* Nút hành động */}
                        <Row gutter={[12, 12]}>
                            <Col xs={24} sm={12} md={12}>
                                <Button
                                    size="large"
                                    block
                                    onClick={() => navigate('/orders')}
                                    disabled={isPending}
                                    style={{ height: '48px' }}
                                >
                                    Hủy bỏ
                                </Button>
                            </Col>
                            <Col xs={24} sm={12} md={12}>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    htmlType="submit"
                                    loading={isPending}
                                    style={{ height: '48px' }}
                                    icon={<ShoppingCartOutlined />}
                                >
                                    Tạo đơn hàng
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default CreateOrderPage;
