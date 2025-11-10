import React, { useState } from 'react';
import { Card, Tag, Button, Empty, Input, Select, Space, Modal, Descriptions, Timeline } from 'antd';
import { 
  ShoppingOutlined, 
  SearchOutlined, 
  FilterOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CreditCardOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const OrderHistory = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sample orders data
  const [orders] = useState([
    {
      orderId: "ORD001",
      orderCode: "EC2024110001",
      shipAddress: "123 Nguyen Hue, Quan 1, TP.HCM",
      orderAmount: 1250000,
      orderStatus: "Delivered",
      paymentMethod: "Credit Card",
      createAt: "2024-11-01T10:30:00",
      updateAt: "2024-11-05T14:20:00",
      deleteAt: null,
      completeAt: "2024-11-05T14:20:00"
    },
    {
      orderId: "ORD002",
      orderCode: "EC2024110002",
      shipAddress: "456 Le Loi, Quan 3, TP.HCM",
      orderAmount: 850000,
      orderStatus: "Shipping",
      paymentMethod: "COD",
      createAt: "2024-11-03T09:15:00",
      updateAt: "2024-11-08T11:30:00",
      deleteAt: null,
      completeAt: null
    },
    {
      orderId: "ORD003",
      orderCode: "EC2024110003",
      shipAddress: "789 Tran Hung Dao, Quan 5, TP.HCM",
      orderAmount: 2100000,
      orderStatus: "Processing",
      paymentMethod: "Bank Transfer",
      createAt: "2024-11-07T15:45:00",
      updateAt: "2024-11-07T15:45:00",
      deleteAt: null,
      completeAt: null
    },
    {
      orderId: "ORD004",
      orderCode: "EC2024110004",
      shipAddress: "321 Vo Van Tan, Quan 3, TP.HCM",
      orderAmount: 540000,
      orderStatus: "Cancelled",
      paymentMethod: "E-Wallet",
      createAt: "2024-11-02T12:00:00",
      updateAt: "2024-11-03T10:00:00",
      deleteAt: "2024-11-03T10:00:00",
      completeAt: null
    },
    {
      orderId: "ORD005",
      orderCode: "EC2024110005",
      shipAddress: "555 Cach Mang Thang 8, Quan 10, TP.HCM",
      orderAmount: 3200000,
      orderStatus: "Pending",
      paymentMethod: "Credit Card",
      createAt: "2024-11-09T08:20:00",
      updateAt: "2024-11-09T08:20:00",
      deleteAt: null,
      completeAt: null
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'green',
      'Shipping': 'blue',
      'Processing': 'orange',
      'Pending': 'default',
      'Cancelled': 'red'
    };
    return colors[status] || 'default';
  };

  const getPaymentIcon = (method) => {
    if (method === 'Credit Card') return '💳';
    if (method === 'COD') return '💵';
    if (method === 'Bank Transfer') return '🏦';
    if (method === 'E-Wallet') return '📱';
    return '💰';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderCode.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.shipAddress.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const getOrderTimeline = (order) => {
    const timeline = [];
    
    if (order.createAt) {
      timeline.push({
        color: 'blue',
        children: (
          <div>
            <div className="font-medium">Đơn hàng đã tạo</div>
            <div className="text-sm text-gray-500">
              {dayjs(order.createAt).format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
        )
      });
    }

    if (order.orderStatus === 'Processing') {
      timeline.push({
        color: 'orange',
        children: (
          <div>
            <div className="font-medium">Đang xử lý</div>
            <div className="text-sm text-gray-500">
              {dayjs(order.updateAt).format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
        )
      });
    }

    if (order.orderStatus === 'Shipping') {
      timeline.push({
        color: 'blue',
        children: (
          <div>
            <div className="font-medium">Đang giao hàng</div>
            <div className="text-sm text-gray-500">
              {dayjs(order.updateAt).format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
        )
      });
    }

    if (order.completeAt) {
      timeline.push({
        color: 'green',
        children: (
          <div>
            <div className="font-medium">Đã giao hàng</div>
            <div className="text-sm text-gray-500">
              {dayjs(order.completeAt).format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
        )
      });
    }

    if (order.deleteAt) {
      timeline.push({
        color: 'red',
        children: (
          <div>
            <div className="font-medium">Đã hủy</div>
            <div className="text-sm text-gray-500">
              {dayjs(order.deleteAt).format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
        )
      });
    }

    return timeline;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <ShoppingOutlined className="mr-3" />
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-600">Quản lý và theo dõi các đơn hàng của bạn</p>
        </div>

        {/* Filter Section */}
        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng hoặc địa chỉ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
              size="large"
            />
            <Select
              placeholder="Lọc theo trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-full md:w-48"
              size="large"
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="Pending">Chờ xử lý</Select.Option>
              <Select.Option value="Processing">Đang xử lý</Select.Option>
              <Select.Option value="Shipping">Đang giao</Select.Option>
              <Select.Option value="Delivered">Đã giao</Select.Option>
              <Select.Option value="Cancelled">Đã hủy</Select.Option>
            </Select>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="shadow-sm">
            <Empty description="Không tìm thấy đơn hàng nào" />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card 
                key={order.orderId}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {order.orderCode}
                      </h3>
                      <Tag color={getStatusColor(order.orderStatus)} className="w-fit">
                        {order.orderStatus}
                      </Tag>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start">
                        <EnvironmentOutlined className="mr-2 mt-1 text-gray-500" />
                        <span className="text-gray-600">{order.shipAddress}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{getPaymentIcon(order.paymentMethod)}</span>
                        <span className="text-gray-600">{order.paymentMethod}</span>
                      </div>

                      <div className="flex items-center">
                        <DollarOutlined className="mr-2 text-gray-500" />
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(order.orderAmount)}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <ClockCircleOutlined className="mr-2 text-gray-500" />
                        <span className="text-gray-600">
                          {dayjs(order.createAt).format('DD/MM/YYYY HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end lg:justify-start">
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => showOrderDetail(order)}
                      size="large"
                      className="w-full sm:w-auto"
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        <Modal
          title={
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">Chi tiết đơn hàng</span>
              {selectedOrder && (
                <Tag color={getStatusColor(selectedOrder.orderStatus)}>
                  {selectedOrder.orderStatus}
                </Tag>
              )}
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>
          ]}
          width={800}
        >
          {selectedOrder && (
            <div className="space-y-6">
              <Descriptions 
                column={{ xs: 1, sm: 2 }}
                labelStyle={{ fontWeight: 600 }}
              >
                <Descriptions.Item label="Mã đơn hàng">
                  {selectedOrder.orderCode}
                </Descriptions.Item>
                <Descriptions.Item label="ID đơn hàng">
                  {selectedOrder.orderId}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  <span className="text-blue-600 font-semibold">
                    {formatCurrency(selectedOrder.orderAmount)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  <span className="flex items-center">
                    <span className="mr-2">{getPaymentIcon(selectedOrder.paymentMethod)}</span>
                    {selectedOrder.paymentMethod}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                  {selectedOrder.shipAddress}
                </Descriptions.Item>
              </Descriptions>

              <div>
                <h3 className="text-lg font-semibold mb-4">Theo dõi đơn hàng</h3>
                <Timeline items={getOrderTimeline(selectedOrder)} />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default OrderHistory;