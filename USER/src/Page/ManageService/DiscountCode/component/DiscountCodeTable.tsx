// src/components/DiscountCodeTable.tsx
import React, { useState, useMemo } from 'react';
import { Table, Tag, Input, Button, Spin, Alert } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { EditOutlined, LockOutlined, PlusOutlined, UnlockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import type { DiscountCodeItem, DiscountCodeUpdate } from '@/Interface/TDiscountCode';

import { DeleteConfirmModal, EditDiscountCodeModal } from './ModifyCodeModal';

import { useGetDiscountCode } from '../hook/useGetdiscountCode';
import { useRemoveDiscountCode } from '../hook/useRemovecode';
import { useUpdateDiscountCode } from '../hook/useUpdatecode';
import { toast } from 'react-toastify';
import { useCreateDiscountCode } from '../hook/usecreateDiscountCode';

const DiscountCodeTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [selectedToggleStatus, setSelectedToggleStatus] = useState<boolean | null>(null);

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
  const [editInitialValues, setEditInitialValues] = useState<DiscountCodeUpdate | null>(null);

  const { data, isLoading, isError, error, refetch } = useGetDiscountCode(page, limit);

  const { mutate: removeDiscountCode, isPending: isRemoving } = useRemoveDiscountCode(
    selectedDeleteId || '',
    {
      onSuccess: () => {
        toast.success('Cập nhật thành công');
        setDeleteModalVisible(false);
        setSelectedDeleteId(null);
        refetch();
      },
      onError: () => {
        toast.error('Cập nhật thất bại');
      },
    }
  );

  const { mutate: updateDiscountCode, isPending: isUpdating } = useUpdateDiscountCode(
    selectedEditId!,
    {
      onSuccess: () => {
        toast.success('Cập nhật thành công');
        setEditModalVisible(false);
        setSelectedEditId(null);
        setEditInitialValues(null);
        refetch();
      },
      onError: () => {
        toast.error('Cập nhật thất bại');
      },
    }
  );

  const { mutate: createDiscountCode, isPending: isCreating } = useCreateDiscountCode({
    onSuccess: () => {
      toast.success('Tạo mã thành công');
      setEditModalVisible(false);
      setEditInitialValues(null);
      refetch();
    },
    onError: () => {
      toast.error('Tạo mã thất bại');
    },
  });

  const filteredData = useMemo<DiscountCodeItem[]>(() => {
    if (!data) return [];
    return data.data.filter((item) =>
      item.discount_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current || 1);
    setLimit(pagination.pageSize || 10);
  };

  const columns: ColumnsType<DiscountCodeItem> = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'discount_code',
      key: 'discount_code',
    },
    {
      title: 'Tên tổ chức',
      dataIndex: 'org_name',
      key: 'org_name',
    },
    {
      title: 'Phần trăm giảm',
      dataIndex: 'value_percentage',
      key: 'value_percentage',
      render: (v) => (v != null ? `${v}%` : 'Nhập %'),
    },

    {
      title: 'Tổng số lượng',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Số lượt dùng',
      dataIndex: 'used_number',
      key: 'used_number',
    },
    {
      title: 'Số còn lại',
      key: 'available_number',
      render: (_, r) =>
        typeof r.total === 'number' && typeof r.used_number === 'number' ? (
          r.total - r.used_number
        ) : (
          <Tag color="default">Không xác định</Tag>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_Available',
      key: 'is_Available',
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Khoá', value: false },
      ],
      onFilter: (val, rec) => rec.is_Available === val,
      render: (av) => (av ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Khoá</Tag>),
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (d) => (d ? dayjs(d).format('DD/MM/YYYY') : '—'),
    },
    {
      title: 'Kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (d) => (d ? dayjs(d).format('DD/MM/YYYY') : '—'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_at',
      key: 'create_at',
      render: (d) => (d ? dayjs(d).format('DD/MM/YYYY HH:mm') : '—'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedEditId(record.id);
              setEditInitialValues({
                discount_code: record.discount_code,
                value_percentage: record.value_percentage ?? 0,
                total: record.total ?? 0,
                start_date: dayjs(record.start_date).format('YYYY-MM-DD'),
                end_date: dayjs(record.end_date).format('YYYY-MM-DD'),
              });
              setEditModalVisible(true);
            }}
          />

          <Button
            icon={
              record.is_Available ? (
                <LockOutlined style={{ color: 'red' }} />
              ) : (
                <UnlockOutlined style={{ color: 'green' }} />
              )
            }
            onClick={() => {
              setSelectedDeleteId(record.id);
              setSelectedToggleStatus(record.is_Available);
              setDeleteModalVisible(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm mã giảm giá..."
          allowClear
          size="large"
          style={{ width: 400 }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditInitialValues({
              discount_code: '',
              total: undefined,
              value_percentage: undefined,
              start_date: '',
              end_date: '',
            });

            setSelectedEditId(null);
            setEditModalVisible(true);
          }}
        >
          Tạo mã
        </Button>
      </div>

      {isLoading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : isError ? (
        <Alert message="Lỗi" description={error?.message} type="error" showIcon />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.totalRecords,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      )}

      <DeleteConfirmModal
        open={deleteModalVisible}
        loading={isRemoving}
        onOk={() => selectedDeleteId && removeDiscountCode()}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedDeleteId(null);
          setSelectedToggleStatus(null);
        }}
        title={selectedToggleStatus ? 'Xác nhận khoá' : 'Xác nhận mở khoá'}
        description={
          selectedToggleStatus
            ? 'Bạn có chắc chắn muốn khoá mục này không?'
            : 'Bạn có chắc chắn muốn mở khoá mục này không?'
        }
        okText={selectedToggleStatus ? 'Khoá' : 'Mở khoá'}
      />

      {editInitialValues && (
        <EditDiscountCodeModal
          open={editModalVisible}
          loading={isUpdating || isCreating}
          initialValues={editInitialValues!}
          title={selectedEditId ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá'}
          onCancel={() => {
            setEditModalVisible(false);
            setEditInitialValues(null);
            setSelectedEditId(null);
          }}
          onSubmit={(vals) => {
            if (selectedEditId) {
              updateDiscountCode(vals);
            } else {
              createDiscountCode(vals);
            }
          }}
        />
      )}
    </>
  );
};

export default DiscountCodeTable;
