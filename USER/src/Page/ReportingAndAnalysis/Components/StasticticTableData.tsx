import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { StatisticResponse } from '@/Interface/TRevenue';
import Loading from '@/Components/Loading';

interface DataType {
  key: string;
  service_name: string;
  ticketsSold: number;
  revenue: string;
  cash: string;
  momo: string;
}

interface StatisticTableDataProps {
  dataSource?: StatisticResponse;
  isLoading?: boolean;
}

const StatisticTableData: React.FC<StatisticTableDataProps> = ({ dataSource, isLoading }) => {

  const transformData = (apiData: StatisticResponse): DataType[] => {
    return Object.entries(apiData).map(([service_name, data], index) => ({
      key: `${index}`,
      service_name,
      ticketsSold: data.quantity,
      revenue: `${data.price.toLocaleString('vi-VN')} VND`,
      cash: `${data.cash.toLocaleString('vi-VN')} `,
      momo: `${data.momo.toLocaleString('vi-VN')} `,
    }));
  };

  const tableData = dataSource && Object.keys(dataSource).length > 0 ? transformData(dataSource) : [];

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên vé',
      dataIndex: 'service_name',
      key: 'service_name',
      sorter: (a, b) => a.service_name.localeCompare(b.service_name),
    },
    {
      title: 'Vé đã bán',
      dataIndex: 'ticketsSold',
      key: 'ticketsSold',
      sorter: (a, b) => a.ticketsSold - b.ticketsSold,
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
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) =>
        parseFloat(a.revenue.replace(/[^\d]/g, '')) - parseFloat(b.revenue.replace(/[^\d]/g, '')),
    },
  ];

  return (
    <div className="relative">
      {isLoading && (
        <Loading/>
      )}
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

export default StatisticTableData;