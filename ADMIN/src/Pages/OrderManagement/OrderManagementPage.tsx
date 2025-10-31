import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  Table,
  Pagination,
  Input,
  Button,
  Space,
  Typography,
  Spin,
  Card,
  Row,
  Col,
  Grid,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useDebounce } from '@/Hook/useDebounce';
import { useGetAllOrders } from './Hook/useGetAllOrders';
import DeleteOrderModal from './Components/DeleteOrderModal';
import CreateOrderModal from './Components/CreateOrderModal';
import { useAuthStore } from '@/Store/IAuth';
import UpdateOrderModal from './Components/UpdateOrderModal';
import ApproveOrderModal from './Components/ApproveOrderModal';

interface OrderData {
  orderId: string;
  orderCode?: string;
  userId?: string;
  status?: string;
  paymentMethod?: string;
  shipAddress?: string;
}

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const OrderManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  //const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [openUpdateItems, setOpenUpdateItems] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);

  //const isDetailView = location.pathname.match(/^\/orders\/[^/]+$/);
  const adminUserId = useAuthStore((state) => state.id) ?? '';
  const isChildRoute = location.pathname !== '/orders';

  const [page, setPage] = useState({
    size: 10,
    number: 0, // 0-based page
    totalElements: 0,
    totalPages: 1,
  });

  const debouncedSearch = useDebounce(searchTerm, 1000);

  // Hook fetch orders
  const { data, isLoading, error, refetch } = useGetAllOrders({
    page: page.number,
    size: page.size,
    sort:
      currentFilter === 'newest'
        ? 'createAt,desc'
        : currentFilter === 'oldest'
          ? 'createAt,asc'
          : undefined,
    keyword: debouncedSearch,
  });

  useEffect(() => {
    if (error) {
      console.error('Lỗi fetch orders:', error);
    }
  }, [error]);

  // Orders & Pagination fallback
  const orders = data?.data?.content ?? [];
  const pagination = data?.data?.page ?? page;

  // Reset page when filter/search changes
  useEffect(() => {
    setPage((prev) => ({ ...prev, number: 0 }));
  }, [currentFilter, debouncedSearch]);


  useEffect(() => {
    if (location.state?.refresh) {
      refetch();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch]);

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
      ellipsis: true,
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 150,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'amount', // đúng key từ API
      key: 'amount',
      width: 120,
      render: (amount?: number | null) => (amount ?? 0).toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status', // đúng key từ API
      key: 'status',
      width: 120,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 140,
      render: (pm?: string | null) => pm ?? '-',
    },
    {
      title: 'Tạo tại',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 140,
      render: (date?: string | null) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Cập nhật tại',
      dataIndex: 'updateAt',
      key: 'updateAt',
      width: 140,
      render: (date?: string | null) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">

          <Button
            icon={<EyeOutlined />}
            type="text"
            onClick={() => navigate(`${record.orderId}`)}
          />
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              setSelectedOrder({ orderId: record.orderId }); // chỉ cần orderId
              setIsUpdateModalOpen(true);
            }}
          />
          <Button
            type="text"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate(`/orders/${record.orderId}/items`)}
          />

          <Button
            type="text"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setOpenApprove(true);
            }}
          >

          </Button>
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={() => {
              setSelectedOrder({ orderId: record.orderId, orderCode: record.orderCode });
              setIsDeleteModalOpen(true);
            }}
          />
        </Space>
      ),
    }
  ];

  const handleFilter = (type: string) => {
    setCurrentFilter(type);
  };

  const handlePageChange = (pageNumber: number, pageSize: number) => {
    setPage({
      ...page,
      number: pageNumber - 1, // 1-based Pagination -> 0-based API
      size: pageSize,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {isChildRoute ? (<Outlet />
      ) : (
        <Card className="max-w-7xl mx-auto shadow-lg">
          <Title level={2} className="text-center mb-6 text-blue-600">
            Quản lý Đơn hàng
          </Title>

          {/* Thanh công cụ */}
          <Row gutter={[16, 16]} justify="space-between" align="middle" className="mb-6">
            <Col xs={24} sm={24} md={10}>
              <Input
                placeholder="Tìm kiếm theo tên khách hàng hoặc ID..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} sm={24} md={14}>
              <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                {/* <Button
                  type="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Tạo đơn mới
                </Button> */}
                <Button
                  type="primary"
                  onClick={() => navigate('/orders/create')}
                >
                  Tạo đơn mới
                </Button>
                <Button
                  icon={<SortAscendingOutlined />}
                  type={currentFilter === 'all' ? 'primary' : 'default'}
                  onClick={() => handleFilter('all')}
                >
                  Tất cả
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  type={currentFilter === 'newest' ? 'primary' : 'default'}
                  onClick={() => handleFilter('newest')}
                >
                  Mới nhất
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  type={currentFilter === 'oldest' ? 'primary' : 'default'}
                  onClick={() => handleFilter('oldest')}
                >
                  Cũ nhất
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Modal */}

          {selectedOrder && (
            <DeleteOrderModal
              open={isDeleteModalOpen}
              orderId={selectedOrder.orderId}
              orderCode={selectedOrder.orderCode}
              onCancel={() => setIsDeleteModalOpen(false)}
              onDeleteSuccess={refetch} // gọi refetch để load lại danh sách orders
            />
          )}

          {/* <CreateOrderModal
            adminUserId={adminUserId}
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              setIsCreateModalOpen(false);
              refetch(); // tải lại danh sách orders sau khi tạo
            }}
          /> */}

          {selectedOrder && (
            <UpdateOrderModal
              open={isUpdateModalOpen}
              orderId={selectedOrder.orderId}
              onClose={() => setIsUpdateModalOpen(false)}
              onSuccess={() => refetch()}
            />
          )}

          <ApproveOrderModal
            open={openApprove}
            onClose={() => setOpenApprove(false)}
            orderData={selectedOrder}
            onSuccess={() => refetch()}
          />

          {/* Bảng đơn hàng */}
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={orders}
              pagination={false}
              rowKey="orderId"
              scroll={{ x: 'max-content' }}
              locale={{ emptyText: 'Không có dữ liệu' }}
            />
          </Spin>



          {/* Phân trang */}
          <div className="mt-6 flex justify-center">
            <Pagination
              current={(pagination?.number ?? 0) + 1} // an toàn khi chưa load
              total={pagination?.totalElements ?? 0}
              pageSize={pagination?.size ?? 10}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                total > 0
                  ? `${range[0]}-${range[1]} của ${total} đơn hàng`
                  : 'Không có đơn hàng nào'
              }
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              className="ant-pagination-responsive"
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderManagementPage;
