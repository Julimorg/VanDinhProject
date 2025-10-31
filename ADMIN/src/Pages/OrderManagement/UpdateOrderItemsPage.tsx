import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  InputNumber,
  Typography,
  Button,
  Space,
  message,
  Card,
  Spin,
  Popconfirm,
  Input,
  Row,
  Col,
  Select,
  Affix,
  Badge,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useUpdateOrderItem } from "./Hook/useUpdateOrderItem";
import { useGetOrderDetail } from "./Hook/useGetOrderDetail";
import { useGetProductSelections } from "./Hook/useGetProductSelection";
import { useDebounce } from "@/Hook/useDebounce";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const UpdateOrderItemsPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, number>
  >({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 400);
  const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>(
    undefined
  );

  const {
    data: orderDetail,
    isLoading,
    refetch,
  } = useGetOrderDetail(orderId!, { enabled: !!orderId });
  const { data: productSelection, isFetching } = useGetProductSelections({
    keyword: debouncedKeyword,
    supplierName: selectedSupplier,
  });

  const { mutate: updateOrderItem, isPending } = useUpdateOrderItem(orderId!, {
    onSuccess: () => {
      toast.success("Cập nhật sản phẩm trong đơn thành công!");
      refetch();
      navigate("/orders");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    },
  });

  useEffect(() => {
    if (orderDetail?.data?.items) {
      setItems(orderDetail.data.items);
    }
  }, [orderDetail]);

  const handleQuantityChange = (value: number, key: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.orderItemId === key ? { ...item, quantity: value } : item
      )
    );
  };
  const handleDelete = (key: string) => {
    setItems((prev) => prev.filter((item) => item.orderItemId !== key));
  };

  const handleCheck = (checked: boolean, productId: string) => {
    setSelectedProducts((prev) => {
      const newState = { ...prev };
      if (checked) newState[productId] = 1;
      else delete newState[productId];
      return newState;
    });
  };

  const handleQuantityAddChange = (productId: string, qty: number | null) => {
    const safeQty = Math.max(1, qty ?? 1);
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: safeQty,
    }));
  };

  const handleAddSelected = () => {
    const ids = Object.keys(selectedProducts);
    if (ids.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm!");
      return;
    }

    const newProducts =
      productSelection?.data
        ?.filter((p: any) => ids.includes(p.productId))
        ?.map((p: any) => ({
          orderItemId: undefined,
          productId: p.productId,
          productName: p.productName,
          productPrice: p.productPrice,
          quantity: selectedProducts[p.productId],
        })) ?? [];

    setItems((prev) => [...prev, ...newProducts]);
    setSelectedProducts({});
    message.success(`Đã thêm ${newProducts.length} sản phẩm vào đơn`);
  };

  const handleSave = () => {
    const payload = {
      orderItems: items.map((i) => ({
        orderItemId: i.orderItemId,
        productId: i.productId,
        quantity: i.quantity,
      })),
    };
    updateOrderItem(payload);
  };

  // Tính tổng tiền
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.productPrice,
    0
  );

  const orderColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "35%",
      render: (t: string) => (
        <Text strong style={{ fontSize: 14 }}>
          {t}
        </Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: "20%",
      align: "center" as const,
      render: (val: number, record: any) => (
        <InputNumber
          min={1}
          value={val}
          onChange={(v) => handleQuantityChange(v || 1, record.orderItemId)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "productPrice",
      width: "20%",
      align: "right" as const,
      render: (v: number) => (
        <Text style={{ fontSize: 14 }}>{v?.toLocaleString("vi-VN")}₫</Text>
      ),
    },
    {
      title: "Thành tiền",
      width: "15%",
      align: "right" as const,
      render: (_: any, record: any) => (
        <Text strong style={{ fontSize: 14, color: "#1890ff" }}>
          {(record.quantity * record.productPrice).toLocaleString("vi-VN")}₫
        </Text>
      ),
    },
    {
      title: "",
      key: "action",
      width: "10%",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xóa sản phẩm này?"
          description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi đơn hàng?"
          onConfirm={() => handleDelete(record.orderItemId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger type="text" size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const productColumns = [
    {
      title: "Mã SP",
      dataIndex: "productId",
      width: 100,
      render: (id: string) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      width: "25%",
      render: (text: string) => (
        <Text strong style={{ fontSize: 14 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierName",
      width: "10%",
      render: (text: string) => (
        <Tag color="green">{text || "Không có"}</Tag>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "productQuantity",
      width: 100,
      align: "center" as const,
      render: (qty: number) => (
        <Badge
          count={qty}
          showZero
          color={qty > 10 ? "#52c41a" : qty > 0 ? "#faad14" : "#ff4d4f"}
          style={{ fontSize: 12 }}
        />
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "productPrice",
      width: 130,
      align: "right" as const,
      render: (p: number) => (
        <Text style={{ fontSize: 14 }}>{p.toLocaleString("vi-VN")}₫</Text>
      ),
    },
    {
      title: "Chọn",
      key: "action",
      width: 150,
      align: "center" as const,
      render: (_: any, record: any) => {
        const isChecked = record.productId in selectedProducts;
        return (
          <Space size="small">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => handleCheck(e.target.checked, record.productId)}
              style={{ cursor: "pointer", transform: "scale(1.2)" }}
            />
            {isChecked && (
              <InputNumber
                min={1}
                max={record.productQuantity}
                value={selectedProducts[record.productId]}
                onChange={(v) => handleQuantityAddChange(record.productId, v)}
                style={{ width: 70 }}
                size="small"
              />
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "24px 24px 120px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <Card
          bordered={false}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: 12,
          }}
          bodyStyle={{ padding: "20px 24px" }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space align="center" size="middle">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/orders")}
                  size="large"
                  type="text"
                />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Đơn hàng
                  </Text>
                  <Title level={3} style={{ margin: 0, marginTop: 4 }}>
                    Cập nhật đơn hàng #{orderId}
                  </Title>
                </div>
              </Space>
            </Col>
            <Col>
              <Tag color="processing" style={{ fontSize: 14, padding: "4px 12px" }}>
                <ShoppingCartOutlined /> {items.length} sản phẩm
              </Tag>
            </Col>
          </Row>
        </Card>

        {/* Sản phẩm hiện tại */}
        <Card
          title={
            <Space>
              <ShoppingCartOutlined style={{ fontSize: 18, color: "#1890ff" }} />
              <Text strong style={{ fontSize: 16 }}>
                Sản phẩm trong đơn hàng
              </Text>
            </Space>
          }
          bordered={false}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: 12,
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <Spin spinning={isLoading}>
            <Table
              columns={orderColumns}
              dataSource={items}
              pagination={false}
              bordered={false}
              rowKey={(r) => r.orderItemId || r.productId}
              scroll={{ x: "max-content" }}
              locale={{ emptyText: "Chưa có sản phẩm nào trong đơn" }}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row style={{ background: "#fafafa" }}>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <Text strong style={{ fontSize: 16 }}>
                        Tổng tiền:
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text
                        strong
                        style={{ fontSize: 18, color: "#ff4d4f" }}
                      >
                        {totalAmount.toLocaleString("vi-VN")}₫
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Spin>
        </Card>

        {/* Thêm sản phẩm mới */}
        <Card
          title={
            <Space>
              <PlusOutlined style={{ fontSize: 18, color: "#52c41a" }} />
              <Text strong style={{ fontSize: 16 }}>
                Thêm sản phẩm vào đơn hàng
              </Text>
            </Space>
          }
          bordered={false}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: 12,
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {/* Bộ lọc */}
            <Card
              bordered={false}
              style={{ background: "#fafafa", borderRadius: 8 }}
              bodyStyle={{ padding: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                  <Input
                    prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                    allowClear
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    size="large"
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Select
                    prefix={<FilterOutlined />}
                    allowClear
                    placeholder="Lọc theo nhà cung cấp"
                    value={selectedSupplier}
                    onChange={(value) => setSelectedSupplier(value)}
                    style={{ width: "100%" }}
                    size="large"
                    options={[
                      ...Array.from(
                        new Set(
                          productSelection?.data
                            ?.map((p: any) => p.supplierName)
                            .filter(Boolean)
                        )
                      ).map((name) => ({
                        label: name,
                        value: name,
                      })),
                    ]}
                  />
                </Col>
              </Row>
            </Card>

            <Table
              columns={productColumns}
              dataSource={
                productSelection?.data?.filter(
                  (p: any) => !items.some((item) => item.productId === p.productId)
                ) ?? []
              }
              rowKey="productId"
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showTotal: (total) => `Tổng ${total} sản phẩm`,
              }}
              bordered={false}
              loading={isFetching}
              scroll={{ x: "max-content" }}
              locale={{ emptyText: "Không tìm thấy sản phẩm phù hợp" }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddSelected}
              size="large"
              disabled={Object.keys(selectedProducts).length === 0}
              style={{ borderRadius: 8 }}
            >
              Thêm {Object.keys(selectedProducts).length > 0 && `(${Object.keys(selectedProducts).length})`} sản phẩm đã chọn
            </Button>
          </Space>
        </Card>
      </Space>

      {/* Action Bar */}
      <Affix offsetBottom={0}>
        <Card
          style={{
            boxShadow: "0 -4px 16px rgba(0,0,0,0.12)",
            border: "none",
            borderRadius: "12px 12px 0 0",
          }}
          bodyStyle={{ padding: "20px 32px" }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space size="large">
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tổng sản phẩm
                  </Text>
                  <div>
                    <Text strong style={{ fontSize: 20 }}>
                      {items.length}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tổng tiền
                  </Text>
                  <div>
                    <Text strong style={{ fontSize: 20, color: "#ff4d4f" }}>
                      {totalAmount.toLocaleString("vi-VN")}₫
                    </Text>
                  </div>
                </div>
              </Space>
            </Col>
            <Col>
              <Space size="middle">
                <Button onClick={() => navigate("/orders")} size="large">
                  Hủy
                </Button>
                <Button
                  type="primary"
                  loading={isPending}
                  onClick={handleSave}
                  disabled={items.length === 0}
                  size="large"
                  style={{ minWidth: 140 }}
                >
                  Lưu thay đổi
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </Affix>
    </div>
  );
};

export default UpdateOrderItemsPage;