import React from 'react';
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import type { ReceipterStatisticDetailResponse } from '@/Interface/TRevenue';
import Loading from '@/Components/Loading';
import { useGetReceipterStatisticDetail } from '../Hooks/useGetReceipterStatisticDetail';

interface DataType {
  key: string;
  cart_id: string;
  service_name: string;
  service_price: number;
  momo: number;
  cash: number;
  quantity: number;
  totalAmount: number;
}

interface ReceipterStatisticDetailProps {
  start_date?: string;
  end_date?: string;
  receipter_name?: string;
}

const ReceipterStatisticDetail: React.FC<ReceipterStatisticDetailProps> = ({
  start_date: propStartDate,
  end_date: propEndDate,
  receipter_name: propReceipterName,
}) => {
  const { user_id } = useParams<{ user_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const start_date = location.state?.startDate || propStartDate || '2025-01-01';
  const end_date = location.state?.endDate || propEndDate || '2025-12-31';
  const receipter_name = location.state?.receipter_name || propReceipterName || 'Unknown';

  const { data, isLoading, error } = useGetReceipterStatisticDetail(
    user_id || '',
    start_date,
    end_date,
    {
      enabled: !!user_id && !!start_date && !!end_date,
    }
  );

  const transformData = (apiData: ReceipterStatisticDetailResponse | undefined): DataType[] => {
    if (!apiData) return [];

    return Object.entries(apiData).flatMap(([cartId, cartData]) =>
      Object.entries(cartData.services).flatMap(([, serviceArray], groupIndex) =>
        serviceArray.map((service, itemIndex) => ({
          key: `${cartId}-${groupIndex}-${itemIndex}`,
          cart_id: cartId,
          service_name: service.service_name,
          service_price: service.service_price,
          momo: service.momo,
          cash: service.cash,
          quantity: service.quantity,
          totalAmount: cartData.totalAmount,
        }))
      )
    );
  };

  const tableData = transformData(data);

  console.log('Table Data:', tableData);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã giỏ hàng',
      dataIndex: 'cart_id',
      key: 'cart_id',
      sorter: (a, b) => a.cart_id.localeCompare(b.cart_id),
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'service_name',
      key: 'service_name',
      sorter: (a, b) => a.service_name.localeCompare(b.service_name),
    },
    {
      title: 'Thanh toán Momo',
      dataIndex: 'momo',
      key: 'momo',
      sorter: (a, b) => a.momo - b.momo,
      render: (value: number) => `${value.toLocaleString('vi-VN')} `,
    },
    {
      title: 'Thanh toán tiền mặt',
      dataIndex: 'cash',
      key: 'cash',
      sorter: (a, b) => a.cash - b.cash,
      render: (value: number) => `${value.toLocaleString('vi-VN')} `,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Giá dịch vụ',
      dataIndex: 'service_price',
      key: 'service_price',
      sorter: (a, b) => a.service_price - b.service_price,
      render: (value: number) => `${value.toLocaleString('vi-VN')} VND`,
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (value: number) => `${value.toLocaleString('vi-VN')} VND`,
    },
  ];

  return (
    <div className="relative p-4">
      {isLoading && <Loading />}
      {error && (
        <div className="text-red-500 text-center">
          Lỗi khi tải dữ liệu: {error.response?.data?.message || 'Vui lòng thử lại.'}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chi tiết thống kê thu ngân: {receipter_name} - {user_id}</h2>
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={{ pageSize: 6 }}
        className="overflow-x-auto"
        rowKey="key"
        locale={{ emptyText: 'Không có dữ liệu' }}
      />
    </div>
  );
};

export default ReceipterStatisticDetail;
