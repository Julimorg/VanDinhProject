import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animate, stagger } from 'animejs';
import { toast } from 'react-toastify';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import type { IGetAllColor } from '@/Interface/Color/IGetAllColor';
import { useGetColors } from './Hook/useGetColorsBySupplier';
import { useGetSupplierDetail } from './Hook/useGetSupplierDetail';

// ---------- Color swatch ----------
const ColorSwatch: React.FC<{ color: IGetAllColor }> = ({ color }) => {
  const handleCopy = () => {
    const code = color.colorCode || color.hexCode;
    navigator.clipboard.writeText(code);
    toast.success(`Đã copy mã màu: ${code}`);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="swatch-item group text-left rounded-md overflow-hidden border border-[#E4E2DD] bg-white transition-shadow duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171716] focus-visible:ring-offset-2"
      style={{ opacity: 0 }}
    >
      <div
        className="h-16 w-full transition-transform duration-300 group-hover:scale-[1.03]"
        style={{ backgroundColor: color.hexCode || '#e5e7eb' }}
      />
      <div className="px-2.5 py-2">
        <p className="text-[13px] font-medium text-[#171716] truncate" title={color.colorName}>
          {color.colorName}
        </p>
        <p className="text-[11px] font-mono text-[#6E6B66] tracking-tight">
          {color.colorCode}
        </p>
      </div>
    </button>
  );
};

// ---------- Skeleton ----------
const SwatchSkeleton: React.FC = () => (
  <div className="rounded-md overflow-hidden border border-[#E4E2DD] bg-white animate-pulse">
    <div className="h-16 w-full bg-[#E4E2DD]" />
    <div className="px-2.5 py-2 space-y-1.5">
      <div className="h-3 w-3/4 bg-[#E4E2DD] rounded" />
      <div className="h-2.5 w-1/2 bg-[#E4E2DD] rounded" />
    </div>
  </div>
);

// ---------- Pill tabs với indicator trượt mượt ----------
interface TabItem {
  key: string;
  label: string;
  count: number;
}

const PillTabs: React.FC<{
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}> = ({ items, activeKey, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const measure = () => {
    const btn = btnRefs.current[activeKey];
    const container = containerRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillStyle({ left: btnRect.left - containerRect.left, width: btnRect.width });
    }
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, items]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  return (
    <div
      ref={containerRef}
      className="relative flex gap-1 overflow-x-auto border-b border-[#E4E2DD] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        className="absolute bottom-0 h-[2px] bg-[#171716] transition-all duration-300 ease-out"
        style={{ left: pillStyle.left, width: pillStyle.width }}
      />
      {items.map((item) => (
        <button
          type="button"
          key={item.key}
          ref={(el) => { btnRefs.current[item.key] = el; }}
          onClick={() => onChange(item.key)}
          className={`relative flex-shrink-0 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
            activeKey === item.key ? 'text-[#171716]' : 'text-[#8A867E] hover:text-[#171716]'
          }`}
        >
          {item.label}
          <span className="ml-1.5 text-xs text-[#ADA99F]">{item.count}</span>
        </button>
      ))}
    </div>
  );
};

// ---------- Pager ----------
const Pager: React.FC<{
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}> = ({ page, totalPages, onChange }) => {
  const pages = useMemo(() => {
    if (totalPages <= 1) return [];
    const windowSize = 5;
    let start = Math.max(0, page - Math.floor(windowSize / 2));
    let end = Math.min(totalPages - 1, start + windowSize - 1);
    start = Math.max(0, end - windowSize + 1);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        type="button"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="w-8 h-8 flex items-center justify-center rounded border border-[#E4E2DD] text-[#6E6B66] disabled:opacity-30 hover:border-[#171716] hover:text-[#171716] transition-colors"
      >
        <LeftOutlined style={{ fontSize: 11 }} />
      </button>

      {pages[0] > 0 && <span className="px-1 text-[#ADA99F]">…</span>}

      {pages.map((p) => (
        <button
          type="button"
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded text-sm transition-colors ${
            p === page
              ? 'bg-[#171716] text-white'
              : 'text-[#6E6B66] border border-[#E4E2DD] hover:border-[#171716] hover:text-[#171716]'
          }`}
        >
          {p + 1}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-[#ADA99F]">…</span>}

      <button
        type="button"
        disabled={page === totalPages - 1}
        onClick={() => onChange(page + 1)}
        className="w-8 h-8 flex items-center justify-center rounded border border-[#E4E2DD] text-[#6E6B66] disabled:opacity-30 hover:border-[#171716] hover:text-[#171716] transition-colors"
      >
        <RightOutlined style={{ fontSize: 11 }} />
      </button>
    </div>
  );
};

// ---------- Main Page ----------
const SupplierDetailPage: React.FC = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState<string>('all');
  const [keyword, setKeyword] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(18);

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { data: supplierRes, isLoading: isLoadingSupplier } = useGetSupplierDetail(supplierId);
  const { data: colorRes, isLoading: isLoadingColors } = useGetColors(supplierId, {
    page, size, keyword: keyword || undefined,
  });

  const supplier = supplierRes?.data;
  const pageData = colorRes?.data;
  const colors: IGetAllColor[] = Array.isArray(pageData?.content) ? pageData.content : [];
  const totalElements = pageData?.page?.totalElements ?? 0;
  const totalPages = pageData?.page?.totalPages ?? 0;

  //? Debounce search — chỉ gọi API sau khi ngừng gõ 350ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setKeyword(keywordInput);
      setPage(0);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [keywordInput]);

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
    return albumGroups[selectedKey] ?? [];
  }, [hasAlbums, selectedKey, colors, unassignedColors, albumGroups]);

  const tabItems: TabItem[] = useMemo(() => {
    const items: TabItem[] = [{ key: 'all', label: 'Tất cả', count: colors.length }];
    albumIds.forEach((id) => {
      items.push({ key: id, label: albumMeta[id] ?? 'Album', count: albumGroups[id]?.length ?? 0 });
    });
    if (unassignedColors.length > 0) {
      items.push({ key: 'unassigned', label: 'Chưa phân loại', count: unassignedColors.length });
    }
    return items;
  }, [colors, albumIds, albumMeta, albumGroups, unassignedColors]);

  //? Header entrance — chạy 1 lần khi supplier load xong
  useEffect(() => {
    if (supplier && headerRef.current) {
      animate(headerRef.current.querySelectorAll('.anim-in'), {
        translateY: [16, 0],
        opacity: [0, 1],
        duration: 600,
        delay: stagger(80),
        easing: 'easeOutExpo',
      });
    }
  }, [supplier?.supplierId]);

  //? Grid stagger — chạy lại mỗi khi danh sách màu hiển thị đổi (search/tab/trang)
  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll('.swatch-item');
    if (items.length === 0) return;
    animate(items, {
      opacity: [0, 1],
      translateY: [10, 0],
      scale: [0.97, 1],
      duration: 420,
      delay: stagger(22),
      easing: 'easeOutQuad',
    });
  }, [displayedColors]);

  const isLoading = isLoadingSupplier || isLoadingColors;

  return (
    <div className="min-h-screen bg-[#F6F6F4]">
      {/* Header band */}
      <div ref={headerRef} className="bg-[#181816] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="anim-in flex items-center gap-1.5 text-sm text-[#B5B2AB] hover:text-white transition-colors mb-5"
            style={{ opacity: 0 }}
          >
            <ArrowLeftOutlined style={{ fontSize: 12 }} />
            Quay lại
          </button>

          <div className="flex items-center gap-4">
            <div
              className="anim-in w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-[#2A2825] flex-shrink-0 flex items-center justify-center"
              style={{ opacity: 0 }}
            >
              {supplier?.supplierImg ? (
                <img src={supplier.supplierImg} alt={supplier.supplierName} className="w-full h-full object-cover" />
              ) : (
                <ShopOutlined style={{ fontSize: 24, color: '#5C5952' }} />
              )}
            </div>

            <div className="anim-in min-w-0" style={{ opacity: 0 }}>
              {isLoadingSupplier ? (
                <div className="h-7 w-48 bg-[#2A2825] rounded animate-pulse" />
              ) : (
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
                  {supplier?.supplierName ?? '—'}
                </h1>
              )}
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#B5B2AB]">
                <span className="flex items-center gap-1.5">
                  <EnvironmentOutlined style={{ fontSize: 12 }} />
                  {supplier?.supplierAddress ?? '—'}
                </span>
                <span className="flex items-center gap-1.5">
                  <PhoneOutlined style={{ fontSize: 12 }} />
                  {supplier?.supplierPhone ?? '—'}
                </span>
                <span className="flex items-center gap-1.5">
                  <MailOutlined style={{ fontSize: 12 }} />
                  {supplier?.supplierEmail ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-[#171716]">
            Bảng màu <span className="font-normal text-[#8A867E]">({totalElements} màu)</span>
          </h2>

          <div className="relative w-full sm:w-72">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADA99F]" style={{ fontSize: 13 }} />
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Tìm theo tên hoặc mã màu..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-[#E4E2DD] bg-white focus:outline-none focus:border-[#171716] transition-colors"
            />
          </div>
        </div>

        {hasAlbums && (
          <div className="mb-5">
            <PillTabs items={tabItems} activeKey={selectedKey} onChange={setSelectedKey} />
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: size }).map((_, i) => <SwatchSkeleton key={i} />)}
          </div>
        ) : totalElements === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#8A867E] text-sm">Nhà cung cấp này chưa có màu nào</p>
          </div>
        ) : displayedColors.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#8A867E] text-sm">Không tìm thấy màu phù hợp</p>
          </div>
        ) : (
          <>
            <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {displayedColors.map((color) => (
                <ColorSwatch key={color.colorId} color={color} />
              ))}
            </div>

            <Pager page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierDetailPage;