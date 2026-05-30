import React, { useState } from 'react';
import { Table, Tag, Tooltip, Input, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, FileTextOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ListPurchaseItemOrder } from '@/Interface/Inventory/GetPurchaseOrderDetail';
import { formatCurrency } from '@/Utils/ulti';
import dayjs from 'dayjs';
import AddProductModal from './AddProductModal';
import { useDeletePurchaseOrderItem } from '../Hooks/useDeletePurchaseOrderItems';

const formatDate = (val?: string) => (val ? dayjs(val).format('DD/MM/YYYY') : '—');

interface POItemsTableProps {
  items: ListPurchaseItemOrder[];
  purchaseOrderId: string;
  onDeleteItem?: (item: ListPurchaseItemOrder) => void; 
}

const POItemsTable: React.FC<POItemsTableProps> = ({
  items,
  purchaseOrderId,
  onDeleteItem,
}) => {
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const { mutate: deleteItem, isPending: isDeleting } = useDeletePurchaseOrderItem(purchaseOrderId);


  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      !q ||
      item.productName.toLowerCase().includes(q) ||
      item.productCode.toLowerCase().includes(q) ||
      item.colorName.toLowerCase().includes(q)
    );
  });

  const columns: ColumnsType<ListPurchaseItemOrder> = [
    {
      title: '#',
      key: 'index',
      width: 48,
      align: 'center',
      render: (_, __, index) => (
        <span className="text-gray-400 text-xs font-mono">
          {String(index + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      minWidth: 220,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-gray-800 text-sm leading-tight">
            {row.productName}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400 font-mono">{row.productCode}</span>
            {row.productVolume && (
              <Tag
                style={{
                  fontSize: 10, padding: '0 5px', lineHeight: '16px',
                  borderRadius: 4, margin: 0,
                  background: '#EEF2FF', color: '#4F46E5', borderColor: '#C7D2FE',
                }}
              >
                {row.productVolume}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Màu sắc',
      dataIndex: 'colorName',
      key: 'colorName',
      width: 120,
      render: (val: string) => (
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
            style={{ background: colorFromName(val) }}
          />
          <span className="text-sm text-gray-600">{val}</span>
        </div>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantityOrdered',
      key: 'quantityOrdered',
      width: 100,
      align: 'center',
      render: (val: number) => (
        <span className="font-bold text-indigo-600 text-base">{val}</span>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 140,
      align: 'right',
      render: (val: number) => (
        <span className="text-sm font-medium text-gray-700">{formatCurrency(val)}</span>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'subtotal',
      width: 150,
      align: 'right',
      render: (_, row) => (
        <span className="text-sm font-bold text-green-700">
          {formatCurrency(row.costPrice * row.quantityOrdered)}
        </span>
      ),
    },
    {
      title: 'HSD',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 110,
      align: 'center',
      render: (val: string) => {
        const expired = val && new Date(val) < new Date();
        return (
          <span className="text-xs font-medium" style={{ color: expired ? '#DC2626' : '#374151' }}>
            {formatDate(val)}
          </span>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 160,
      render: (val: string) =>
        val ? (
          <Tooltip title={val}>
            <div className="flex items-center gap-1 cursor-default">
              <FileTextOutlined className="text-amber-400 text-xs" />
              <span className="text-xs text-gray-500 truncate max-w-[120px]">{val}</span>
            </div>
          </Tooltip>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
    // ── Cột Xoá ──
    {
      title: '',
      key: 'action',
      width: 56,
      align: 'center',
      render: (_, row) => (
        <Popconfirm
          title="Xoá sản phẩm này?"
          description="Sản phẩm sẽ bị xoá khỏi phiếu nhập kho."
          onConfirm={() => deleteItem(row.itemId)} 
          okText="Xoá"
          cancelText="Huỷ"
          okButtonProps={{ danger: true }}
          placement="leftTop"
        >
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            style={{
              width: 30, height: 30, padding: 0,
              border: '1px solid #FCA5A5',
              background: '#FEF2F2',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          />
        </Popconfirm>
      ),
    },
  ];

  const totalQty = filtered.reduce((s, i) => s + i.quantityOrdered, 0);
  const totalAmt = filtered.reduce((s, i) => s + i.costPrice * i.quantityOrdered, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-gray-800">Danh sách sản phẩm</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {filtered.length} sản phẩm · {totalQty} đơn vị
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200, borderRadius: 8 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
            style={{ background: '#4F46E5', borderColor: '#4F46E5', fontWeight: 600, borderRadius: 8 }}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="productId"
        pagination={false}
        scroll={{ x: 900 }}
        size="middle"
        rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <span className="text-sm font-bold text-gray-700 pl-1">Tổng cộng</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center">
                <span className="font-bold text-indigo-600 text-base">{totalQty}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} />
              <Table.Summary.Cell index={5} align="right">
                <span className="font-bold text-green-700 text-sm">{formatCurrency(totalAmt)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} colSpan={3} />
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <AddProductModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        purchaseOrderId={purchaseOrderId}
        onSuccess={() => setOpenCreate(false)}
      />
    </div>
  );
};

function colorFromName(name: string): string {
  const map: Record<string, string> = {
    'trắng ngà': '#FFF8DC', trắng: '#FFFFFF',
    'xám xi măng': '#8E9BAA', xám: '#9CA3AF',
    'xanh dương': '#3B82F6', 'xanh lá': '#22C55E',
    đỏ: '#EF4444', vàng: '#EAB308',
    đen: '#1E293B', nâu: '#92400E',
  };
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v;
  }
  return '#E5E7EB';
}

export default POItemsTable;