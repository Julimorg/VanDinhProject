import React, { useState, useCallback } from 'react';
import { ConfigProvider, message, Select } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useGetAllPurchaseOrders } from './Hooks/useGetPurchaseOrder';
import { DEFAULT_PARAMS, PAGE_SIZE_OPTIONS } from '@/Constant/inventory-contants';
import { FilterParams, Order } from '@/Types/inventory/purchaseOrderTypes';
import FilterBar from './Components/FilterBar';
import PurchaseOrderGrid from './Components/PurchaseOrderGrid';
import CreatePurchaseOrderModal from './Components/CreatePurchaseOrderModal';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/Constant/query-key';
import { useNavigate } from 'react-router-dom';

const PurchaseOrderPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<FilterParams>(DEFAULT_PARAMS);
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);

  const { data, isLoading, isFetching } = useGetAllPurchaseOrders(
    {
      keyword: params.search || undefined,
      status: params.status || undefined,
      orderDateFrom: params.orderDateFrom,
      orderDateTo: params.orderDateTo,
      page: params.page - 1,
      size: params.pageSize,
      sort: 'createAt,desc',
    },
    { placeholderData: (prev: any) => prev }
  );

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_PURCHASE_ORDERS] });
  };

  const orders: Order[] = Array.isArray(data?.data?.content) ? (data.data.content as Order[]) : [];
  const total = data?.data?.page?.totalElements ?? 0;
  const totalPages = Math.ceil(total / params.pageSize) || 1;

  const updateFilter = useCallback((patch: Partial<FilterParams>) => {
    setParams((prev) => ({
      ...prev,
      ...patch,
      ...('page' in patch ? {} : { page: 1 }),
    }));
  }, []);

  const changePage = useCallback((page: number) => setParams((p) => ({ ...p, page })), []);
  const resetFilter = useCallback(() => setParams(DEFAULT_PARAMS), []);

  const handleView = (order: Order) => {
  navigate(`/inventory/${order.purchaseOrderId}`);
};
  const handleEdit = (order: Order) => message.success(`Chỉnh sửa: ${order.poCode}`);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, sans-serif",
        },
      }}
    >
      <div style={{ minHeight: '100vh', background: '#F4F5F7' }}>
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: '#4F46E5',
                  boxShadow: '0 4px 14px rgba(79,70,229,.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <InboxOutlined style={{ color: '#fff', fontSize: 20 }} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#1E293B',
                    margin: 0,
                    lineHeight: 1.25,
                  }}
                >
                  Phiếu nhập kho
                </h1>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, marginTop: 2 }}>
                  Quản lý Purchase Order
                </p>
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: '#4F46E5', borderColor: '#4F46E5', fontWeight: 600 }}
              onClick={() => setOpenCreate(true)}
            >
              Tạo phiếu mới
            </Button>
          </div>

          {/* Filter */}
          <FilterBar
            params={params}
            onSearch={(val) => updateFilter({ search: val })}
            onStatusChange={(val) => updateFilter({ status: val })}
            onDateRangeChange={(from, to) => updateFilter({ orderDateFrom: from, orderDateTo: to })}
            onReset={resetFilter}
            total={total}
          />

          {/* Grid */}
          <PurchaseOrderGrid
            orders={orders}
            loading={isLoading}
            isFetching={isFetching}
            onView={handleView}
            onEdit={handleEdit}
          />

          <CreatePurchaseOrderModal
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onSuccess={handleCreateSuccess}
          />

          {/* Pagination */}
          {total > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <Select
                value={params.pageSize}
                onChange={(val) => updateFilter({ pageSize: val, page: 1 })}
                style={{ width: 120 }}
                options={PAGE_SIZE_OPTIONS.map((n) => ({ value: n, label: `${n} / trang` }))}
                popupMatchSelectWidth={false}
              />
              <button
                disabled={params.page <= 1}
                onClick={() => changePage(params.page - 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  background: '#fff',
                  cursor: params.page <= 1 ? 'not-allowed' : 'pointer',
                  opacity: params.page <= 1 ? 0.4 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: '#374151',
                }}
              >
                ‹
              </button>
              <div
                style={{
                  height: 32,
                  minWidth: 40,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1.5px solid #4F46E5',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#4F46E5',
                }}
              >
                {params.page}
              </div>
              <button
                disabled={params.page >= totalPages}
                onClick={() => changePage(params.page + 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  background: '#fff',
                  cursor: params.page >= totalPages ? 'not-allowed' : 'pointer',
                  opacity: params.page >= totalPages ? 0.4 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: '#374151',
                }}
              >
                ›
              </button>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                {(params.page - 1) * params.pageSize + 1}–
                {Math.min(params.page * params.pageSize, total)} / {total} phiếu
              </span>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PurchaseOrderPage;
