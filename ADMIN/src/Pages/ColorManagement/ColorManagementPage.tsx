import React, { useState } from 'react';
import { 
  Input, 
  Button, 
  Space, 
  Typography, 
  Select, 
  Card, 
  Row, 
  Col, 
  Pagination, 
  Empty 
} from 'antd';
import { 
  SearchOutlined, 
  CalendarOutlined, 
  SortAscendingOutlined, 
  UserOutlined, 
  EditOutlined, 
  CopyOutlined, 
  DeleteOutlined, 
  DownloadOutlined, 
  LeftOutlined, 
  RightOutlined, 
  LayoutOutlined, 
  AppstoreOutlined, 
  BorderOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Color {
  colorId: string;
  colorName: string;
  colorCode: string;
  colorDescription: string;
  colorImg: string;
  createAt: string;
  updateAt: string;
  supplierName?: string;
}

const mockSuppliers = [
  { id: '1', name: 'Bạch Tuyết' },
  { id: '2', name: 'Công ty ABC' },
  { id: '3', name: 'Doanh nghiệp DEF' }
];

const ColorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [sortBy, setSortBy] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const colors: Color[] = [
    {
      colorId: "2abf9d37-789b-438c-bada-4832952e83af",
      colorName: "BROWN",
      colorCode: "#001203",
      colorDescription: "Brown Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1755952986/imgBROWN_2025-08-23.png",
      createAt: "2025-08-23T19:43:07.116991",
      updateAt: "2025-08-23T19:43:07.116991",
      supplierName: "Bạch Tuyết"
    },
    {
      colorId: "a8762613-14b5-4346-8519-80e24e58cf07",
      colorName: "LUNA",
      colorCode: "#31213",
      colorDescription: "Luna Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1756710477/imgLUNA_2025-09-01.png",
      createAt: "2025-09-01T14:07:58.173788",
      updateAt: "2025-09-01T14:07:58.174785",
      supplierName: "Công ty ABC"
    },
    {
      colorId: "12fd7341-f60c-43e4-9932-babda8a28710",
      colorName: "OCTA",
      colorCode: "#12933",
      colorDescription: "purple Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758862605/imgOCTA_2025-09-26.png",
      createAt: "2025-09-26T13:38:56.165415",
      updateAt: "2025-09-26T13:38:56.165415",
      supplierName: "Doanh nghiệp DEF"
    },
    {
      colorId: "587315b7-4858-4def-990d-6b099905610b",
      colorName: "OCTA",
      colorCode: "#12933",
      colorDescription: "purple Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758862605/imgOCTA_2025-09-26.png",
      createAt: "2025-09-26T12:02:46.263184",
      updateAt: "2025-09-26T12:02:46.264187",
      supplierName: "Bạch Tuyết"
    },
    {
      colorId: "50d36526-9ffa-4e73-9a07-414a374c04ed",
      colorName: "OCTA",
      colorCode: "#12933",
      colorDescription: "purple Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758862605/imgOCTA_2025-09-26.png",
      createAt: "2025-09-26T11:59:44.184545",
      updateAt: "2025-09-26T11:59:44.184545",
      supplierName: "Công ty ABC"
    },
    {
      colorId: "0f132694-76dd-4a78-b472-d55eb3a5c8d6",
      colorName: "OCTA",
      colorCode: "#12933",
      colorDescription: "purple Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758862605/imgOCTA_2025-09-26.png",
      createAt: "2025-09-26T13:39:14.848777",
      updateAt: "2025-09-26T13:39:14.848777",
      supplierName: "Doanh nghiệp DEF"
    },
    {
      colorId: "fd72f50c-3e03-4e72-93da-0b8fd0ec371e",
      colorName: "OCTA",
      colorCode: "#12933",
      colorDescription: "purple Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758862605/imgOCTA_2025-09-26.png",
      createAt: "2025-09-26T11:56:47.532427",
      updateAt: "2025-09-26T11:56:47.532427",
      supplierName: "Bạch Tuyết"
    },
    {
      colorId: "ef3c589a-82d5-4a23-91a0-e0264f5a226b",
      colorName: "PINK",
      colorCode: "#039O1312",
      colorDescription: "Pink Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1756710449/imgPINK_2025-09-01.png",
      createAt: "2025-09-01T14:07:29.913855",
      updateAt: "2025-09-01T14:07:29.914856",
      supplierName: "Công ty ABC"
    },
    {
      colorId: "8dc90bd1-91a2-45e2-81af-5f2d88dd2053",
      colorName: "PURPLE",
      colorCode: "#12931",
      colorDescription: "purple Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1756710521/imgPURPLE_2025-09-01.png",
      createAt: "2025-09-01T14:08:42.410046",
      updateAt: "2025-09-01T14:08:42.410046",
      supplierName: "Doanh nghiệp DEF"
    },
    {
      colorId: "d6783e8d-d4e0-46fe-8c1a-483460872330",
      colorName: "PURPLE",
      colorCode: "#12931",
      colorDescription: "purple Color",
      colorImg: "https://res.cloudinary.com/dabbl1kwh/image/upload/v1758861807/imgPURPLE_2025-09-26.png",
      createAt: "2025-09-26T11:43:28.91796",
      updateAt: "2025-09-26T11:43:28.91796",
      supplierName: "Bạch Tuyết"
    }
  ];

  const totalPages = 2;
  const itemsPerPage = 10;

  let filteredColors = colors.filter(color => 
    (color.colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.colorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.colorDescription.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedSupplier === 'all' || color.supplierName === mockSuppliers.find(s => s.id === selectedSupplier)?.name)
  );

  if (sortBy === 'newest') {
    filteredColors.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
  } else if (sortBy === 'oldest') {
    filteredColors.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedColors = filteredColors.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getGridCols = () => {
    switch(viewMode) {
      case 'compact': return { xs: 2, sm: 3, md: 4, lg: 6 };
      case 'comfortable': return { xs: 1, sm: 2, md: 3, lg: 4 };
      case 'spacious': return { xs: 1, sm: 2, md: 3 };
      default: return { xs: 1, sm: 2, md: 3, lg: 4 };
    }
  };

  const getSwatchHeight = () => {
    switch(viewMode) {
      case 'compact': return 96; // h-24 ~ 96px
      case 'comfortable': return 160; // h-40 ~ 160px
      case 'spacious': return 224; // h-56 ~ 224px
      default: return 160;
    }
  };

  const ColorCard = ({ color }: { color: Color }) => (
    <Col {...getGridCols()}>
      <Card
        hoverable
        className="rounded-2xl border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
        bodyStyle={{ padding: viewMode === 'compact' ? '12px' : '16px' }}
        onMouseEnter={() => setHoveredColor(color.colorId)}
        onMouseLeave={() => setHoveredColor(null)}
      >
        <div 
          className="relative overflow-hidden mb-3"
          style={{ 
            height: getSwatchHeight(), 
            background: `linear-gradient(135deg, ${color.colorCode} 0%, ${color.colorCode}dd 100%)`,
            borderRadius: '8px'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <code className="text-white font-bold text-lg drop-shadow-lg">
              {color.colorCode}
            </code>
          </div>
          
          {hoveredColor === color.colorId && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                className="text-white hover:bg-white/20 rounded-lg" 
                onClick={() => {/* Handle edit */}}
                size="small"
              />
              <Button 
                type="text" 
                icon={<CopyOutlined />} 
                className="text-white hover:bg-white/20 rounded-lg" 
                onClick={() => copyToClipboard(color.colorCode)}
                size="small"
              />
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                className="text-white hover:bg-white/20 rounded-lg" 
                danger
                onClick={() => {/* Handle delete */}}
                size="small"
              />
            </div>
          )}
        </div>

        <Title level={5} className={viewMode === 'compact' ? 'text-sm mb-1' : 'text-base mb-2'}>
          {color.colorName}
        </Title>
        
        {viewMode !== 'compact' && (
          <Text className="text-sm text-gray-600 mb-3 block line-clamp-2">
            {color.colorDescription}
          </Text>
        )}

        <Space className="w-full mb-2">
          <img 
            src={color.colorImg} 
            alt={color.colorName}
            className={`rounded object-cover ${viewMode === 'compact' ? 'w-5 h-5' : 'w-6 h-6'}`}
          />
          <Text className="text-xs text-gray-500 truncate flex-1">
            {color.supplierName || 'N/A'}
          </Text>
        </Space>

        {viewMode !== 'compact' && (
          <Text className="text-xs text-gray-400 block">
            Tạo: {formatDate(color.createAt)}
          </Text>
        )}

        <div 
          className="h-1 w-full mt-2 rounded-b-full"
          style={{ backgroundColor: color.colorCode }}
        />
      </Card>
    </Col>
  );

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <Title level={2} className="mb-6 text-center">Quản lý các mã màu</Title>

      {/* Flexible Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg mb-6">
        <Space direction="vertical" className="w-full" style={{ display: 'flex' }}>
          {/* First Row: Search & View Mode */}
          <Space className="w-full" align="center" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div className="flex-1 min-w-200px">
              <Input
                placeholder="Tìm kiếm theo tên, mã màu hoặc mô tả..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl min-w-[200px]"
                allowClear
              />
            </div>

            <Space>
              <Button
                onClick={() => setViewMode('compact')}
                type={viewMode === 'compact' ? 'primary' : 'default'}
                icon={<LayoutOutlined />}
                size="small"
                className="rounded-lg"
              >
                Compact
              </Button>
              <Button
                onClick={() => setViewMode('comfortable')}
                type={viewMode === 'comfortable' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                size="small"
                className="rounded-lg"
              >
                Thoải mái
              </Button>
              <Button
                onClick={() => setViewMode('spacious')}
                type={viewMode === 'spacious' ? 'primary' : 'default'}
                icon={<BorderOutlined />}
                size="small"
                className="rounded-lg"
              >
                Rộng rãi
              </Button>
            </Space>
          </Space>

          {/* Second Row: Filters */}
          <Space wrap>
            <Button 
              onClick={() => setSortBy('all')}
              type={sortBy === 'all' ? 'primary' : 'default'}
              size="small"
              className="rounded-full"
            >
              Tất cả
            </Button>
            <Button 
              onClick={() => setSortBy('newest')}
              type={sortBy === 'newest' ? 'primary' : 'default'}
              icon={<CalendarOutlined />}
              size="small"
              className="rounded-full"
            >
              Mới nhất
            </Button>
            <Button 
              onClick={() => setSortBy('oldest')}
              type={sortBy === 'oldest' ? 'primary' : 'default'}
              icon={<CalendarOutlined />}
              size="small"
              className="rounded-full"
            >
              Cũ nhất
            </Button>

            <Select
              value={selectedSupplier}
              onChange={setSelectedSupplier}
              placeholder="Tất cả nhà cung cấp"
              prefix={<UserOutlined />}
              size="small"
              className="min-w-[150px] rounded-full"
              allowClear
            >
              <Option value="all">Tất cả nhà cung cấp</Option>
              {mockSuppliers.map(supplier => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>

            <Button icon={<DownloadOutlined />} size="small" className="rounded-full">
              Export
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Dynamic Color Grid */}
      <Row gutter={[16, 16]} className="mb-6">
        {paginatedColors.map((color) => (
          <ColorCard key={color.colorId} color={color} />
        ))}
      </Row>

      {/* Empty State */}
      {paginatedColors.length === 0 && (
        <Empty 
          description={
            <Space direction="vertical" align="center">
              <Title level={3}>Không tìm thấy màu nào</Title>
              <Text type="secondary">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</Text>
            </Space>
          }
          className="col-span-full"
        >
          <div className="text-6xl mb-4">🎨</div>
        </Empty>
      )}

      {/* Pagination */}
      {filteredColors.length > itemsPerPage && (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <Row justify="space-between" align="middle">
            <Col>
              <Text>
                Hiển thị <Text strong style={{ color: '#9333ea' }}>{paginatedColors.length}</Text> trong tổng số{' '}
                <Text strong style={{ color: '#9333ea' }}>{filteredColors.length}</Text> màu sắc
              </Text>
            </Col>
            <Col>
              <Pagination
                current={currentPage}
                total={filteredColors.length}
                pageSize={itemsPerPage}
                onChange={setCurrentPage}
                showSizeChanger={false}
                itemRender={(current, type, originalElement) => {
                  if (type === 'prev') return <Button icon={<LeftOutlined />} />;
                  if (type === 'next') return <Button icon={<RightOutlined />} />;
                  return originalElement;
                }}
                className="rounded-xl"
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default ColorList;