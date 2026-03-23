import React, { useState, useEffect, useMemo } from 'react';
import { Input, Dropdown, List, Avatar, Modal, Spin } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSearchAll } from '../Hook/useSearchAll';
import type { ISearchAllResponse } from '../../../Interface/Elasticsearch/ISearchAll';

interface HeaderSearchProps {
  placeholder?: string;
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({
  placeholder = 'Tìm kiếm sản phẩm...',
}) => {
  const navigate = useNavigate();

  // States cho Desktop và Mobile
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState('');

  // Lấy query hiện tại đang được sử dụng (ưu tiên mobile nếu modal đang mở)
  const activeQuery = mobileOpen ? mobileQuery : query;

  // Debounce query để không spam API
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(activeQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [activeQuery]);

  // Gọi API thông qua Hook
  const { data: searchData, isFetching } = useSearchAll(
    {
      keyword: debouncedQuery,
      page: 0,
      size: 10,
    },
    {
      enabled: debouncedQuery.trim().length > 0,
    }
  );

  const es = useMemo(() => {
    const content = searchData?.data?.content;
    return Array.isArray(content) ? (content as unknown as ISearchAllResponse[]) : [];
  }, [searchData?.data?.content]);

  const handleItemClick = (entityId: string, type: string) => {
    setOpen(false);
    setMobileOpen(false);
    setQuery('');
    setMobileQuery('');

    if (type === 'PRODUCT') {
      navigate(`/products/${entityId}`);
    }
  };

  /* ── Desktop dropdown list ── */
  const dropdownContent = (
    <div
      className="bg-white rounded-lg shadow-lg border border-gray-100"
      style={{ minWidth: 250, maxWidth: 400 }}
    >
      <Spin spinning={isFetching} size="small">
        <List
          itemLayout="horizontal"
          dataSource={es}
          locale={{ emptyText: debouncedQuery ? 'Không tìm thấy kết quả' : 'Nhập để tìm kiếm' }}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleItemClick(item.entityId, item.type)}
              className="hover:bg-gray-50 cursor-pointer px-3 py-2 rounded-md transition-colors"
              style={{ padding: '8px 12px' }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.image}
                    shape="square"
                    size={40}
                    style={{ borderRadius: 6, objectFit: 'cover' }}
                  />
                }
                title={
                  <span className="text-sm font-medium text-gray-800 line-clamp-1">
                    {item.name}
                  </span>
                }
                description={
                  <span className="text-xs text-blue-600 font-semibold">
                    {item.type === 'PRODUCT' ? `${item.price?.toLocaleString('vi-VN')} đ` : null}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Spin>
    </div>
  );

  /* ── Mobile search modal ── */
  const mobileModal = (
    <Modal
      open={mobileOpen}
      onCancel={() => {
        setMobileOpen(false);
        setMobileQuery('');
      }}
      footer={null}
      closable={false}
      centered={false}
      styles={{
        body: { padding: 0 },
        content: {
          borderRadius: 12,
          padding: 0,
          top: 0,
          margin: '0 8px',
        },
      }}
      style={{ top: 8 }}
      width="calc(100vw - 16px)"
    >
      {/* Modal Header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-100">
        <Input
          autoFocus
          placeholder={placeholder}
          prefix={<SearchOutlined className="text-gray-400" />}
          value={mobileQuery}
          onChange={(e) => setMobileQuery(e.target.value)}
          variant="borderless"
          className="flex-1 text-base"
          style={{ fontSize: 16 }} // Prevents iOS auto-zoom
        />
        <button
          onClick={() => {
            setMobileOpen(false);
            setMobileQuery('');
          }}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <CloseOutlined className="text-gray-500 text-sm" />
        </button>
      </div>

      {/* Mobile Results */}
      {mobileQuery.length > 0 && (
        <div className="overflow-y-auto relative" style={{ maxHeight: '60vh' }}>
          <Spin spinning={isFetching} size="default" wrapperClassName="w-full mt-4">
            <List
              itemLayout="horizontal"
              dataSource={es}
              locale={{ emptyText: 'Không tìm thấy kết quả' }}
              renderItem={(item) => (
                <List.Item
                  onClick={() => handleItemClick(item.entityId, item.type)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  style={{ padding: '10px 16px' }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.image}
                        shape="square"
                        size={44}
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                    }
                    title={
                      <span className="text-sm font-medium text-gray-800">
                        {item.name}
                      </span>
                    }
                    description={
                      <span className="text-xs text-blue-600 font-semibold">
                        {item.type === 'PRODUCT' ? `${item.price?.toLocaleString('vi-VN')} đ` : null}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Spin>
        </div>
      )}
    </Modal>
  );

  return (
    <>
      {/* ── Desktop: full input with dropdown ── */}
      <div className="hidden md:flex w-full flex-1 justify-center px-4 max-w-lg mx-auto">
        <Dropdown
          dropdownRender={() => dropdownContent}
          open={open && query.length > 0}
          trigger={['click']}
          placement="bottomLeft"
        >
          <Input
            placeholder={placeholder}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)} // Tăng delay xíu để click vào item không bị miss
            className="w-full"
            style={{ maxWidth: 420 }}
          />
        </Dropdown>
      </div>

      {/* ── Mobile: icon button that opens full-screen modal ── */}
      <div className="flex md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Tìm kiếm"
        >
          <SearchOutlined className="text-gray-700 text-lg" />
        </button>
      </div>

      {/* Mobile modal */}
      {mobileModal}
    </>
  );
};

export default HeaderSearch;