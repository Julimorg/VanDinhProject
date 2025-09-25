import { Table } from 'antd';
import type { TableProps } from 'antd';
import { formatCurrency, formatToVietnamTime } from '@/Utils';
import type { Transaction } from '@/Interface/TShift';
import React from 'react';

interface DataType {
  key: string;
  contractID: string;
  phoneNum: string;
  userName: string;
  userEmail: string;
  dateTime: string;
  totalPrice: number;
  checkout: string;
}

interface DataAfterShiftProps {
  transactions: Transaction[] | null;
}

const DataAfterShift: React.FC<DataAfterShiftProps> = ({ transactions }) => {
  //? Dùng useMEMO để optimize render transaction data thay vì dùng map
  const data: DataType[] = React.useMemo(
    () =>
      transactions
        ? transactions.map((transaction, index) => ({
            key: transaction.id || String(index),
            contractID: transaction.id ? `#${transaction.id}` : `#${index}`,
            phoneNum: transaction.customer_phone_number || 'N/A',
            userName: transaction.customer_name || 'N/A',
            userEmail: transaction.customer_email || 'N/A',
            dateTime: formatToVietnamTime(transaction.create_at),
            totalPrice: transaction.total_price ?? 0,
            checkout: transaction.method || 'N/A',
          }))
        : [],
    [transactions]
  );

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Mã Giao Dịch',
      dataIndex: 'contractID',
      key: 'contractID',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Thời gian',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (text: string) => text,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Thanh Toán',
      dataIndex: 'checkout',
      key: 'checkout',
    },
    // Mở rộng tính năng
    // {
    //   title: 'Hình Thức',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button
    //         type="link"
    //         icon={<EditOutlined />}
    //         onClick={() => handleViewDetail(record.contractID)}
    //       />
    //     </Space>
    //   ),
    // },
  ];

  return <Table<DataType> columns={columns} dataSource={data} />;
};

export default DataAfterShift;
