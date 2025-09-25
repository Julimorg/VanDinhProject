import React from 'react';
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ReceipterStatisticResponse } from '@/Interface/TRevenue';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Loading from '@/Components/Loading';

interface DataType {
  key: string;
  user_id: string;
  receipter_name: string;
  total_order: number;
  total_revenue: number;
  momo: string;
  cash: string;
}

interface ReceipterStatisticTableDataProps {
  dataSource?: { data: ReceipterStatisticResponse };
  isLoading?: boolean;
  startDate?: string;
  endDate?: string;
}

const ReceipterStatisticTable: React.FC<ReceipterStatisticTableDataProps> = ({
  dataSource,
  isLoading,
  startDate,
  endDate,
}) => {
  const navigate = useNavigate();
  const transformData = (apiData: ReceipterStatisticResponse): DataType[] => {
    if (!apiData) return [];

    return Object.entries(apiData).map(([receipter_name, data], index) => ({
      key: `${index}`,
      receipter_name,
      user_id: data?.user_id,
      total_order: data?.total_order ? parseInt(data.total_order, 10) : 0,
      total_revenue: data?.total_revenue ?? 0,
      cash: data?.cash != null ? `${data.cash.toLocaleString('vi-VN')} ` : '0 ',
      momo: data?.momo != null ? `${data.momo.toLocaleString('vi-VN')}` : '0 ',
    }));
  };

  const tableData =
    dataSource?.data && Object.keys(dataSource.data).length > 0
      ? transformData(dataSource.data)
      : [];

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên Thu Ngân',
      dataIndex: 'receipter_name',
      key: 'receipter_name',
      sorter: (a, b) => a.receipter_name.localeCompare(b.receipter_name),
    },
    {
      title: 'Tổng đơn bán được',
      dataIndex: 'total_order',
      key: 'total_order',
      sorter: (a, b) => a.total_order - b.total_order,
    },

    {
      title: 'Tiền mặt',
      dataIndex: 'cash',
      key: 'cash',
      sorter: (a, b) =>
        parseFloat(a.cash.replace(/[^\d]/g, '')) - parseFloat(b.cash.replace(/[^\d]/g, '')),
    },
    {
      title: 'Momo',
      dataIndex: 'momo',
      key: 'momo',
      sorter: (a, b) =>
        parseFloat(a.momo.replace(/[^\d]/g, '')) - parseFloat(b.momo.replace(/[^\d]/g, '')),
    },
    {
      title: 'Tổng Doanh thu',
      dataIndex: 'total_revenue',
      key: 'total_revenue',
      sorter: (a, b) => a.total_revenue - b.total_revenue,
      render: (value: number) => `${value.toLocaleString('vi-VN')} VND`,
    },
    {
    title: 'Hình thức',
    key: 'action',
    dataIndex: 'user_id',
    width: 120,
    render: (_, record) => {
      // console.log('Record in ReceipterStatisticTable:', record); 
      return (
        <Button
          type="link"
          icon={<EyeOutlined />}
          title="Xem chi tiết thông tin"
          onClick={() =>
            navigate(`/reportingAndAnalysis/detail/${record.user_id}`, {
              state: { startDate, endDate, receipter_name: record.receipter_name },
            })
          }
        >
          Xem chi tiết
        </Button>
      );
    },
  },
  ];

  return (
    <div className="relative">
      {isLoading && <Loading />}
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

export default ReceipterStatisticTable;
