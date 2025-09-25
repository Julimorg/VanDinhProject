import { useState } from 'react';
import { Button, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined } from '@ant-design/icons';
import type { DiscountServiceItem, EditDiscountService } from '@/Interface/TDiscountService';
import { useEditServiceDiscount } from '../hook/useEditDiscountService';
import EditDiscountServiceModal from './EditDiscountServiceModal';
import { toast } from 'react-toastify';

const { Text } = Typography;

interface DiscountTableProps {
  data: DiscountServiceItem[];
  isLoading: boolean;
  onRefresh?: () => void;
}

const DiscountTableData = ({ data, isLoading, onRefresh }: DiscountTableProps) => {
  const [editingId, setEditingId] = useState<string | undefined>();
  const [editingRecord, setEditingRecord] = useState<DiscountServiceItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { mutate: editDiscountService, isPending: isSubmitting } = useEditServiceDiscount({
    onSuccess: () => {
      toast.success('Sửa giảm giá thành công');
      setModalVisible(false);
      onRefresh?.();
    },
    onError: () => {
      toast.error('Sửa giảm giá thất bại');
    },
  });

  const handleEdit = (record: DiscountServiceItem) => {
    setEditingId(record.id);
    setEditingRecord(record);
    setModalVisible(true);
  };

  const handleModalSubmit = (values: any) => {
    if (!editingId || !editingRecord) return;

    const [start, end] = values.dateRange;

    const body: EditDiscountService = {
      start_date: start.format('YYYY-MM-DD'),
      end_date: end.format('YYYY-MM-DD'),
      discount_type: 'PERCENTAGE',
      apply_for_target: editingRecord.apply_for_target,
      discount_value_vnd: String(values.discount_value_vnd),
      discount_value_another: String(values.discount_value_another ?? 0),
    };

    editDiscountService({ id: editingId, body });
  };

  const columns: ColumnsType<DiscountServiceItem> = [
    {
      title: 'Mã dịch vụ',
      dataIndex: 'service_id',
      key: 'service_id',
      render: (id) => id || 'N/A',
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: ['service', 'name'],
      key: 'service_name',
      render: (_, record) => record.service_name || 'N/A',
    },
    {
      title: 'Loại giảm giá',
      dataIndex: 'discount_type',
      key: 'discount_type',
      render: (type) => (type === 'PERCENTAGE' ? <Tag color="green">Phần trăm</Tag> : 'N/A'),
    },
    {
      title: 'Giá trị giảm',
      key: 'discount_value_vnd',
      render: (_, record) => {
        if (record.discount_type === 'PERCENTAGE') {
          return `${record.discount_value_vnd}%`;
        }

        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(record.discount_value_vnd || 0);
      },
      sorter: (a, b) => (a.discount_value_vnd || 0) - (b.discount_value_vnd || 0),
    },

    {
      title: 'Áp dụng cho',
      dataIndex: 'apply_for_target',
      key: 'apply_for_target',
      filters: [
        { text: 'Người lớn', value: 'ADULT' },
        { text: 'Trẻ em', value: 'CHILDREN' },
      ],
      onFilter: (value, record) => record.apply_for_target === value,
      render: (target) =>
        target === 'ADULT' ? <Tag color="blue">Người lớn</Tag> : <Tag color="orange">Trẻ em</Tag>,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      sorter: (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      render: (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'),
    },

    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'),
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      render: (_, record) => (
        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white border rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Danh sách giảm giá dịch vụ</h2>
      </div>

      {!data.length && !isLoading && (
        <Text type="secondary" className="block mb-4">
          Chưa có dữ liệu giảm giá. Vui lòng thử lại hoặc kiểm tra bộ lọc.
        </Text>
      )}

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Không có dữ liệu' }}
        loading={isLoading}
      />

      <EditDiscountServiceModal
        visible={modalVisible}
        id={editingId}
        confirmLoading={isSubmitting}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        record={editingRecord || undefined}
      />
    </div>
  );
};

export default DiscountTableData;
