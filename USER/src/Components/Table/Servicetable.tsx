import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Input } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { EditOutlined, LockOutlined, UnlockOutlined, PlusOutlined } from '@ant-design/icons';
import type { TServiceItem } from '@/Interface/TServiceItems';

interface ServiceTableProps {
  data: TServiceItem[];
  customColumns?: ColumnsType<TServiceItem>;
  showAddButton?: boolean;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddicon?: (id: string) => void;
  showImage?: boolean;
  availabilityMap?: Record<string, boolean>;
  pagination?: TablePaginationConfig;
  actionsColumnTitle?: string;
  isDiscounted?: (service: TServiceItem) => boolean;
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  data,
  customColumns,
  onAdd,
  onEdit,
  onDelete,
  onAddicon,
  showImage = true,
  availabilityMap = {},
  showAddButton,
  pagination,
  actionsColumnTitle,
  isDiscounted,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      item.service_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const defaultColumns: ColumnsType<TServiceItem> = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'service_name',
      key: 'service_name',
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: 'service_type',
      key: 'service_type',
    },
    {
      title: 'Giá gốc',
      dataIndex: 'origin_price',
      key: 'origin_price',
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Mô tả',
      dataIndex: 'service_description',
      key: 'service_description',
    },
    ...(showImage
      ? [
          {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (url: string) => (
              <img src={url} alt="Dịch vụ" style={{ width: 50, height: 50, objectFit: 'cover' }} />
            ),
          },
        ]
      : []),

    {
      title: 'Cổng',
      dataIndex: 'client_id',
      key: 'client_id',
    },
    {
      title: 'Combo',
      dataIndex: 'is_Combo',
      key: 'is_Combo',
      render: (combo: boolean) =>
        combo ? <Tag color="green">Có</Tag> : <Tag color="red">Không</Tag>,
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      render: (_, record) =>
        record.discount_type === 'PERCENTAGE' ? (
          <Tag color="orange">{record.discount_value_vnd}%</Tag>
        ) : (
          <Tag color="gray">Không</Tag>
        ),
    },
    {
      title: 'Giá sau giảm',
      key: 'discount_price',
      render: (_, record) =>
        record.discount_price != null ? (
          <span style={{ color: 'green' }}>{record.discount_price.toLocaleString()} VND</span>
        ) : (
          ''
        ),
    },

    {
      title: actionsColumnTitle || 'Thao tác',
      key: 'actions',
      render: (_, record) => {
        const available = availabilityMap[record.service_id || ''] ?? true;

        return (
          <div style={{ display: 'flex', gap: 8 }}>
            {onEdit && (
              <Button
                icon={<EditOutlined />}
                type="text"
                onClick={() => onEdit(record.service_id!)}
              />
            )}

            {onDelete && (
              <Button
                icon={
                  available ? (
                    <LockOutlined style={{ color: 'red' }} />
                  ) : (
                    <UnlockOutlined style={{ color: 'green' }} />
                  )
                }
                type="text"
                danger
                onClick={() => onDelete(record.service_id!)}
              />
            )}

            {onAddicon && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => onAddicon(record.service_id!)}
                disabled={isDiscounted?.(record)}
              >
                Thêm khuyến mãi
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Input.Search
          placeholder="Tìm kiếm tên dịch vụ..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
          style={{ width: 600 }}
        />

        {showAddButton && onAdd && (
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onAdd}>
            Tạo dịch vụ
          </Button>
        )}
      </div>

      <Table
        dataSource={filteredData}
        columns={customColumns ?? defaultColumns}
        rowKey="service_id"
        pagination={pagination ?? { pageSize: 10 }}
      />
    </div>
  );
};

export default ServiceTable;
