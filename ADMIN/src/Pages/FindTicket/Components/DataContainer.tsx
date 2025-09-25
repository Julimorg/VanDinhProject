import React, { useMemo } from 'react';
import { Button, Empty, Space, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ResSearchTicker } from '@/Interface/TSearchTicket';
import { formatToVietnamTime } from '@/Utils';

interface DataType {
  key: string;
  method: string;
  cart_id: string;
  total_price: number;
  customer_phone_number: string;
  customer_email: string;
  customer_name: string;
  create_at: string;
}

interface DataContainerProps {
  data?: ResSearchTicker[];
  isLoading: boolean;
}

export const DataContainer: React.FC<DataContainerProps> = ({ data, isLoading }) => {
  console.log('DataContainer received data:', data);
  const navigate = useNavigate();

  const handleViewDetail = (contractID: string) => {
    // const cleanContractID = contractID.replace('#', '');
    // console.log(contractID);
    navigate(`/find-ticket/detail-ticket/${contractID}`, { replace: true });
  };

  const tableData: DataType[] = useMemo(
    () =>
      data
        ? data.map((transaction, index) => ({
            key: transaction.cart_id || String(index),
            method: transaction.method || 'N/A',
            cart_id: transaction.cart_id || `TICKET${index}`,
            total_price: transaction.total_price ?? 0,
            customer_phone_number: transaction.customer_phone_number || 'N/A',
            customer_email: transaction.customer_email || 'N/A',
            customer_name: transaction.customer_name || 'N/A',
            create_at: formatToVietnamTime(transaction.create_at),
          }))
        : [],
    [data]
  );

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Mã Giao Dịch',
      dataIndex: 'cart_id',
      key: 'cart_id',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'customer_phone_number',
      key: 'customer_phone_number',
      render: (text: string) => <a>{text || 'N/A'}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'customer_email',
      key: 'customer_email',
      render: (text: string) => <a>{text || 'N/A'}</a>,
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (text: string) => <a>{text || 'N/A'}</a>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'create_at',
      key: 'create_at',
      render: (text: string) => <a>{text || 'N/A'}</a>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (value: number) =>
        value ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ',
    },
    {
      title: 'Thanh Toán',
      dataIndex: 'method',
      key: 'method',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Hình Thức',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            title="Xem chi tiết"
            onClick={() => handleViewDetail(record.cart_id)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<DataType>
      columns={columns}
      dataSource={tableData}
      loading={isLoading}
      locale={{
        emptyText: <Empty description="Không có dữ liệu" />,
      }}
    />
  );
};
