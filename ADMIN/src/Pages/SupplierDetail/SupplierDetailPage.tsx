import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Typography, Button, Spin, Empty, Menu, Tag, Input, Pagination, message, Avatar, Space,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  ArrowLeftOutlined, AppstoreOutlined, FolderOutlined, InboxOutlined,
  SearchOutlined, ShopOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined,
  PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { useGetSupplierDetail } from './hooks/useGetSupplierDetail';
import { IGetAllColor } from '@/Interface/Color/IGetAllColor';
import AddColorModal from './Components/AddColorModal';
import DeleteColorModal from './Components/DeleteColorModal';
import ImportColorJsonModal from './Components/ImportJsonModal';
import EditColorModal from './Components/UpdateColorModal';
import { useGetColors } from './hooks/useGetColorsBySupplier';

const { Title, Text } = Typography;

interface ColorSwatchCardProps {
  color: IGetAllColor;
  onEdit: (color: IGetAllColor) => void;
  onDelete: (color: IGetAllColor) => void;
}

const ColorSwatchCard: React.FC<ColorSwatchCardProps> = ({ color, onEdit, onDelete }) => {
  const handleCopy = () => {
    const code = color.colorCode || color.hexCode;
    navigator.clipboard.writeText(code);
    message.success(`Đã copy mã màu: ${code}`);
  };

  return (
    <div className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Overlay action buttons — chỉ hiện khi hover */}
      <div className="absolute top-1.5 right-1.5 z-10 hidden group-hover:flex gap-1">
        <Button
          size="small"
          shape="circle"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(color);
          }}
        />
        <Button
          size="small"
          shape="circle"
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(color);
          }}
        />
      </div>

      <div
        onClick={handleCopy}
        className="cursor-pointer h-20 w-full transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: color.hexCode || '#e5e7eb' }}
      />
      <div className="p-2.5">
        <Text strong ellipsis className="block text-sm text-gray-800" title={color.colorName}>
          {color.colorName}
        </Text>
        <Text type="secondary" className="text-xs">{color.colorCode}</Text>
      </div>
    </div>
  );
};

const SupplierDetailPage: React.FC = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [editingColor, setEditingColor] = useState<IGetAllColor | undefined>(undefined);
  const [deletingColor, setDeletingColor] = useState<IGetAllColor | undefined>(undefined);

  const { data: supplierRes, isLoading: isLoadingSupplier } = useGetSupplierDetail(supplierId);

  const { data: colorRes, isLoading: isLoadingColors, refetch: refetchColors } = useGetColors(supplierId, {
    page, size, keyword: keyword || undefined,
  });

  const supplier = supplierRes?.data;
  const pageData = colorRes?.data;
  const colors: IGetAllColor[] = Array.isArray(pageData?.content) ? pageData.content : [];
  const totalElements = pageData?.page?.totalElements ?? 0;

  const { albumGroups, albumMeta, unassignedColors } = useMemo(() => {
    const groups: Record<string, IGetAllColor[]> = {};
    const meta: Record<string, string> = {};
    const unassigned: IGetAllColor[] = [];

    for (const c of colors) {
      if (c.albumId) {
        if (!groups[c.albumId]) groups[c.albumId] = [];
        groups[c.albumId].push(c);
        if (c.albumName) meta[c.albumId] = c.albumName;
      } else {
        unassigned.push(c);
      }
    }

    return { albumGroups: groups, albumMeta: meta, unassignedColors: unassigned };
  }, [colors]);

  const albumIds = useMemo(() => Object.keys(albumGroups), [albumGroups]);
  const hasAlbums = albumIds.length > 0;

  const displayedColors: IGetAllColor[] = useMemo(() => {
    if (!hasAlbums || selectedKey === 'all') return colors;
    if (selectedKey === 'unassigned') return unassignedColors;
    return albumGroups[selectedKey] ?? ([] as IGetAllColor[]);
  }, [hasAlbums, selectedKey, colors, unassignedColors, albumGroups]);

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: 'all',
        icon: <AppstoreOutlined />,
        label: (
          <span className="flex items-center justify-between w-full pr-1">
            <span>Tất cả màu (trang này)</span>
            <Tag className="ml-2">{colors.length}</Tag>
          </span>
        ),
      },
      ...albumIds.map((albumId) => ({
        key: albumId,
        icon: <FolderOutlined />,
        label: (
          <span className="flex items-center justify-between w-full pr-1">
            <span className="truncate">{albumMeta[albumId] ?? 'Album'}</span>
            <Tag className="ml-2">{albumGroups[albumId]?.length ?? 0}</Tag>
          </span>
        ),
      })),
    ];

    if (unassignedColors.length > 0) {
      items.push({
        key: 'unassigned',
        icon: <InboxOutlined />,
        label: (
          <span className="flex items-center justify-between w-full pr-1">
            <span>Chưa phân loại</span>
            <Tag className="ml-2">{unassignedColors.length}</Tag>
          </span>
        ),
      });
    }

    return items;
  }, [albumIds, albumMeta, albumGroups, unassignedColors, colors]);

  const currentTitle = useMemo(() => {
    if (!hasAlbums) return 'Toàn bộ màu sắc';
    if (selectedKey === 'all') return 'Tất cả màu';
    if (selectedKey === 'unassigned') return 'Chưa phân loại';
    return albumMeta[selectedKey] ?? 'Màu sắc';
  }, [hasAlbums, selectedKey, albumMeta]);

  const isLoading = isLoadingSupplier || isLoadingColors;

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      <div className="mb-4 flex items-center gap-3">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
        <Title level={3} className="!mb-0 text-gray-900">Chi tiết Nhà cung cấp</Title>
      </div>

      <Spin spinning={isLoadingSupplier}>
        <Card className="mb-6 shadow-sm border-0 bg-white rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar
              src={supplier?.supplierImg}
              icon={<ShopOutlined />}
              size={88}
              shape="square"
              className="rounded-xl border border-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Title level={4} className="!mb-2 text-gray-900">{supplier?.supplierName ?? '—'}</Title>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-1.5 text-gray-600">
                <span className="flex items-center gap-1.5 text-sm">
                  <EnvironmentOutlined className="text-gray-400" />
                  {supplier?.supplierAddress ?? '—'}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <PhoneOutlined className="text-gray-400" />
                  {supplier?.supplierPhone ?? '—'}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <MailOutlined className="text-gray-400" />
                  {supplier?.supplierEmail ?? '—'}
                </span>
              </div>
              {supplier?.createAt && (
                <Text type="secondary" className="text-xs block mt-2">
                  Tạo lúc: {new Date(supplier.createAt).toLocaleDateString('vi-VN')}
                </Text>
              )}
            </div>
          </div>
        </Card>
      </Spin>

      <Card className="shadow-sm border-0 bg-white rounded-xl" bodyStyle={{ padding: 0 }}>
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Title level={5} className="!mb-0">
            Bảng màu <Tag color="blue">{totalElements} màu</Tag>
          </Title>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              placeholder="Tìm theo tên hoặc mã màu..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              allowClear
              className="sm:w-64"
            />
            <Space>
              <Button icon={<UploadOutlined />} onClick={() => setImportModalVisible(true)}>
                Import JSON
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
                Thêm màu
              </Button>
            </Space>
          </div>
        </div>

        <Spin spinning={isLoading}>
          {totalElements === 0 ? (
            <div className="py-12"><Empty description="Nhà cung cấp này chưa có màu nào" /></div>
          ) : (
            <div className="flex flex-col sm:flex-row">
              {hasAlbums && (
                <div className="sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-100 p-3">
                  <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={({ key }) => setSelectedKey(key)}
                    items={menuItems}
                    className="!border-none"
                  />
                </div>
              )}

              <div className="flex-1 p-5">
                {hasAlbums && (
                  <Text strong className="block mb-3 text-gray-700">
                    {currentTitle}{' '}
                    <Text type="secondary" className="font-normal text-sm">
                      ({displayedColors.length} màu trong trang này)
                    </Text>
                  </Text>
                )}

                {displayedColors.length === 0 ? (
                  <Empty description="Không tìm thấy màu phù hợp" />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {displayedColors.map((color) => (
                      <ColorSwatchCard
                        key={color.colorId}
                        color={color}
                        onEdit={setEditingColor}
                        onDelete={setDeletingColor}
                      />
                    ))}
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <Pagination
                    current={page + 1}
                    pageSize={size}
                    total={totalElements}
                    onChange={(p, s) => { setPage(p - 1); setSize(s); }}
                    showSizeChanger
                  />
                </div>
              </div>
            </div>
          )}
        </Spin>
      </Card>

      {supplierId && (
        <>
          <AddColorModal
            visible={addModalVisible}
            onCancel={() => setAddModalVisible(false)}
            suppliers={[]}
            defaultSupplierId={supplierId}
            lockSupplierSelect
            onAddSuccess={() => refetchColors()}
          />

          <ImportColorJsonModal
            visible={importModalVisible}
            onCancel={() => setImportModalVisible(false)}
            supplierId={supplierId}
            onImportSuccess={() => refetchColors()}
          />
        </>
      )}

      <EditColorModal
        visible={!!editingColor}
        onCancel={() => setEditingColor(undefined)}
        color={editingColor}
        onSuccess={() => refetchColors()}
      />

      <DeleteColorModal
        visible={!!deletingColor}
        onCancel={() => setDeletingColor(undefined)}
        colorId={deletingColor?.colorId ?? ''}
        colorName={deletingColor?.colorName ?? ''}
      />
    </div>
  );
};

export default SupplierDetailPage;