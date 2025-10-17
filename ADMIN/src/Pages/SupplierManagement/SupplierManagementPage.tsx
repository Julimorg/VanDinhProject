
import React, { useState } from 'react';
import { Table, Pagination, Input, Button, Space, Typography, Card, Spin } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { SearchOutlined, DownOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetAllSupplier } from './Hook/useGetSupplier';
import { useDebounce } from '@/Hook/useDebounce';
import AddSupplierModal from './Components/CreateSupplierModal';
import EditSupplierModal from './Components/EditSupplierModal';
import DeleteSupplierModal from './Components/DeleteSupplierModal';

const { Title, Text } = Typography;

const SupplierManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [selectedSupplierToDelete, setSelectedSupplierToDelete] = useState<any>(null);

  const debouncedKeyword = useDebounce(searchTerm, 300);

  const { data, isLoading, error, refetch } = useGetAllSupplier(
    {
      keyword: debouncedKeyword || undefined,
      page: currentPage,
      size: pageSize,
      sort: 'createAt,desc'
    },
  );

  //? Cast explicit để tránh never[] union, dùng ?? cho nullish
  const suppliers: any[] = (data?.data?.content ?? []) as any[];

  const pagination = data?.data?.page || {
    size: pageSize,
    number: currentPage,
    totalElements: 0,
    totalPages: 0,
  };

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'supplierId',
      key: 'supplierId',
      width: 120,
      ellipsis: true,
      sorter: (a: any, b: any) => a.supplierId.localeCompare(b.supplierId),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Tên nhà cung cấp
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      render: (text: string) => <Text strong>{text}</Text>,
      sorter: (a: any, b: any) => a.supplierName.localeCompare(b.supplierName),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Địa chỉ
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'supplierAddress',
      key: 'supplierAddress',
      width: 120,
      sorter: (a: any, b: any) => a.supplierAddress.localeCompare(b.supplierAddress),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Điện thoại
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'supplierPhone',
      key: 'supplierPhone',
      width: 120,
      sorter: (a: any, b: any) => a.supplierPhone.localeCompare(b.supplierPhone),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Email
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'supplierEmail',
      key: 'supplierEmail',
      width: 180,
      ellipsis: true,
      sorter: (a: any, b: any) => a.supplierEmail.localeCompare(b.supplierEmail),
      showSorterTooltip: false,
    },
    {
      title: 'Ảnh',
      dataIndex: 'supplierImg',
      key: 'supplierImg',
      width: 80,
      render: (img: string) => <img src={img} alt="Supplier" className="w-10 h-10 rounded object-cover" />,
    },
    {
      title: (
        <span className="flex items-center">
          Tạo tại
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'createAt',
      key: 'createAt',
      width: 140,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a: any, b: any) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
      showSorterTooltip: false,
    },
    {
      title: (
        <span className="flex items-center">
          Cập nhật tại
          <DownOutlined className="ml-1 text-xs text-gray-400" />
        </span>
      ),
      dataIndex: 'updateAt',
      key: 'updateAt',
      width: 140,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a: any, b: any) => new Date(a.updateAt).getTime() - new Date(b.updateAt).getTime(),
      showSorterTooltip: false,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record: any) => (
        <Space size="small" wrap className="flex flex-col sm:flex-row">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="p-0"
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="p-0"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  //? Handle pagination: Chuyển 1-based từ UI sang 0-based cho API
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page - 1); // Chuyển về 0-based
    if (pageSize) setPageSize(pageSize);
  };

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsEditModalVisible(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedSupplier(null);
  };

  // Thêm function handleDelete
  const handleDelete = (supplier: any) => {
    setSelectedSupplierToDelete(supplier);
    setIsDeleteModalVisible(true);
  };

  // Thêm function handleCloseDeleteModal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setSelectedSupplierToDelete(null);
  };

  //? Handle success cho edit/add/delete
  const handleSuccess = () => {
    refetch?.();
  };

  //? Table props
  const tableProps: Partial<TableProps<any>> = {
    onChange: (pagination, filters, sorter) => {
      console.log('Sorter:', sorter);
    },
  };

  //? Locale cho Pagination
  const paginationLocale = {
    items_per_page: 'mục / trang',
    jump_to: 'Đi đến',
    jump_to_confirm: 'xác nhận',
    page_size: 'số trang',
    prev_page: 'Trang trước',
    next_page: 'Trang sau',
    prev_5: '5 trang trước',
    next_5: '5 trang sau',
    prev_3: '3 trang trước',
    next_3: '3 trang sau',
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <Text type="danger">
          Lỗi tải dữ liệu nhà cung cấp: {error instanceof Error ? error.message : String(error) || 'Lỗi không xác định'}
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="text-center sm:text-left text-gray-900 mb-2 text-lg sm:text-xl">
            Quản lý Nhà cung cấp
          </Title>
          <Text type="secondary" className="block text-sm text-center sm:text-left">
            Tổng số: {pagination.totalElements} nhà cung cấp
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
          size="large"
          className="w-full sm:w-auto"
        >
          Thêm nhà cung cấp
        </Button>
      </div>


      <Card
        className="mb-6 shadow-sm border-0 bg-white rounded-xl"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên nhà cung cấp hoặc email... (hỗ trợ có dấu)"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-lg border-gray-300 focus:border-blue-500"
              size="large"
              allowClear
              style={{ minWidth: '250px' }}
            />
          </div>
          <Text type="secondary" className="text-sm self-center hidden sm:block">
            Tìm Kiếm
          </Text>
        </div>
      </Card>

      {/* Table với Spin loading (cập nhật columns) */}
      <Spin spinning={isLoading}>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <Table
            columns={columns}
            dataSource={suppliers} 
            pagination={false}
            scroll={{ x: 768 }}
            rowKey="supplierId"
            className="border-none"
            locale={{ emptyText: <div className="text-center py-8"><Text>Không có dữ liệu</Text></div> }}
            {...tableProps}
            size="middle"
          />
        </div>
      </Spin>

      {/* Pagination (giữ nguyên) */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex justify-center">
        <Pagination
          current={currentPage + 1} 
          total={pagination.totalElements}
          pageSize={pageSize}
          showSizeChanger={window.innerWidth >= 768}
          showQuickJumper={window.innerWidth >= 1024}
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} nhà cung cấp`}
          onChange={handlePageChange}
          onShowSizeChange={handlePageChange}
          locale={paginationLocale}
          className="w-auto"
          size={window.innerWidth < 768 ? 'small' : 'default'}
        />
      </div>

      {/* Modal add (cập nhật onSuccess với refetch) */}
      <AddSupplierModal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
          handleSuccess();
        }}
      />

      {/* Modal edit */}
      <EditSupplierModal
        visible={isEditModalVisible}
        onCancel={handleCloseEditModal}
        supplier={selectedSupplier}
        onSuccess={() => {
          handleCloseEditModal();
          handleSuccess();
        }}
      />

      {/* Thêm Modal delete */}
      <DeleteSupplierModal
        visible={isDeleteModalVisible}
        onCancel={handleCloseDeleteModal}
        supplier={selectedSupplierToDelete}
        onSuccess={() => {
          handleCloseDeleteModal();
          handleSuccess();
        }}
      />
    </div>
  );
};

export default SupplierManagementPage;