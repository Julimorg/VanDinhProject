import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Button,
  Spin,
  Empty,
  Menu,
  Tag,
  Input,
  message,
  Avatar,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  ArrowLeftOutlined,
  AppstoreOutlined,
  FolderOutlined,
  InboxOutlined,
  SearchOutlined,
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useGetSupplierDetail } from './hooks/useGetSupplierDetail';
import { useGetAlbumsBySupplier, AlbumItem } from '../ColorManagement/Hook/useGetAlbum';
import { ColorItem, useGetColorsBySupplier } from '../ColorManagement/Hook/useGetColorBySupplier';

const { Title, Text } = Typography;

const ColorSwatchCard: React.FC<{ color: ColorItem }> = ({ color }) => {
  const handleCopy = () => {
    const code = color.colorCode || color.colorHex;
    navigator.clipboard.writeText(code);
    message.success(`Đã copy mã màu: ${code}`);
  };

  return (
    <div
      onClick={handleCopy}
      className="group cursor-pointer rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="h-20 w-full transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: color.colorHex || '#e5e7eb' }}
      />
      <div className="p-2.5">
        <Text strong ellipsis className="block text-sm text-gray-800" title={color.colorName}>
          {color.colorName}
        </Text>
        <Text type="secondary" className="text-xs">
          {color.colorCode}
        </Text>
      </div>
    </div>
  );
};

const SupplierDetailPage: React.FC = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');

  const { data: supplierRes, isLoading: isLoadingSupplier } = useGetSupplierDetail(supplierId);
  const { data: colors = [], isLoading: isLoadingColors } = useGetColorsBySupplier(supplierId);
  const { data: albums = [], isLoading: isLoadingAlbums } = useGetAlbumsBySupplier(supplierId);

  const supplier = supplierRes?.data;

  //? Group màu theo album; màu không có albumId gom vào "unassigned"
  const { albumGroups, unassignedColors, totalColors } = useMemo(() => {
    const groups: Record<string, ColorItem[]> = {};
    const unassigned: ColorItem[] = [];

    colors.forEach((c) => {
      if (c.albumId) {
        if (!groups[c.albumId]) groups[c.albumId] = [];
        groups[c.albumId].push(c);
      } else {
        unassigned.push(c);
      }
    });

    return { albumGroups: groups, unassignedColors: unassigned, totalColors: colors.length };
  }, [colors]);

  const hasAlbums = albums.length > 0;

  //? Danh sách màu đang hiển thị theo mục đang chọn ở menu
  const displayedColors = useMemo(() => {
    let base: ColorItem[];
    if (!hasAlbums) {
      base = colors;
    } else if (selectedKey === 'all') {
      base = colors;
    } else if (selectedKey === 'unassigned') {
      base = unassignedColors;
    } else {
      base = albumGroups[selectedKey] ?? [];
    }

    if (!keyword.trim()) return base;
    const kw = keyword.trim().toLowerCase();
    return base.filter(
      (c) =>
        c.colorName?.toLowerCase().includes(kw) ||
        c.colorCode?.toLowerCase().includes(kw)
    );
  }, [hasAlbums, selectedKey, colors, unassignedColors, albumGroups, keyword]);

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: 'all',
        icon: <AppstoreOutlined />,
        label: (
          <span className="flex items-center justify-between w-full pr-1">
            <span>Tất cả màu</span>
            <Tag className="ml-2">{totalColors}</Tag>
          </span>
        ),
      },
      ...albums.map((album: AlbumItem) => ({
        key: album.albumId,
        icon: <FolderOutlined />,
        label: (
          <span className="flex items-center justify-between w-full pr-1">
            <span className="truncate">{album.albumName}</span>
            <Tag className="ml-2">{albumGroups[album.albumId]?.length ?? 0}</Tag>
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
  }, [albums, albumGroups, unassignedColors, totalColors]);

  const currentTitle = useMemo(() => {
    if (!hasAlbums) return 'Toàn bộ màu sắc';
    if (selectedKey === 'all') return 'Tất cả màu';
    if (selectedKey === 'unassigned') return 'Chưa phân loại';
    const album = albums.find((a: AlbumItem) => a.albumId === selectedKey);
    return album?.albumName ?? 'Màu sắc';
  }, [hasAlbums, selectedKey, albums]);

  const isLoading = isLoadingSupplier || isLoadingColors || isLoadingAlbums;

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Title level={3} className="!mb-0 text-gray-900">
          Chi tiết Nhà cung cấp
        </Title>
      </div>

      <Spin spinning={isLoadingSupplier}>
        {/* Supplier info card */}
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
              <Title level={4} className="!mb-2 text-gray-900">
                {supplier?.supplierName ?? '—'}
              </Title>
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

      {/* Color section */}
      <Card className="shadow-sm border-0 bg-white rounded-xl" bodyStyle={{ padding: 0 }}>
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Title level={5} className="!mb-0">
            Bảng màu <Tag color="blue">{totalColors} màu</Tag>
          </Title>
          <Input
            placeholder="Tìm theo tên hoặc mã màu..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            className="sm:w-72"
          />
        </div>

        <Spin spinning={isLoadingColors || isLoadingAlbums}>
          {totalColors === 0 ? (
            <div className="py-12">
              <Empty description="Nhà cung cấp này chưa có màu nào" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row">
              {/* Sidebar menu: chỉ hiện khi có album */}
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

              {/* Content */}
              <div className="flex-1 p-5">
                {hasAlbums && (
                  <Text strong className="block mb-3 text-gray-700">
                    {currentTitle}{' '}
                    <Text type="secondary" className="font-normal text-sm">
                      ({displayedColors.length} màu)
                    </Text>
                  </Text>
                )}

                {displayedColors.length === 0 ? (
                  <Empty description="Không tìm thấy màu phù hợp" />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {displayedColors.map((color) => (
                      <ColorSwatchCard key={color.colorId} color={color} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default SupplierDetailPage;