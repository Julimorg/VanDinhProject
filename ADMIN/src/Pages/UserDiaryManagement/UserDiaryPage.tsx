import React, { useState, useCallback, useEffect } from 'react';
import { Select, Empty, Button, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { PAGE_SIZE_OPTIONS } from '@/Constant/inventory-contants';
import DiaryCard from './Components/DiaryCard';
import DiaryFilterBar from './Components/DiaryFilterBar';
import DiaryStatsRow from './Components/DiaryStat';
import { IGetDiaryResponse } from '@/Interface/Diary/GetDiary';
import { GetDiaryRes, DiaryStatus, DiaryFilterParams, DEFAULT_FILTER } from './Hooks/diary';
import { useGetAllDiary } from './Hooks/useGetAllDiary';
import { toast } from 'react-toastify';
import { CreateDiaryModal } from './Components/CreateDiaryModal';

const mapDiary = (d: IGetDiaryResponse): GetDiaryRes => ({
  id: d.id,
  diaryName: d.diaryName,
  diaryStatus: d.diaryStatus as DiaryStatus,
  totalAmount: d.totalAmount,
  totalQuantity: d.totalQuantity,
  note: d.note,
  createdBy: d.createdBy,
  createdAt: d.createdAt,
  updatedAt: d.updatedAt,
});

// ── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonDiaryCard: React.FC = () => (
  <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gray-200" />
    <div className="flex flex-col gap-3 pl-5 pr-4 pt-4 pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton.Input active size="small" style={{ width: 80, height: 10, borderRadius: 4 }} />
          <Skeleton.Input active style={{ width: '90%', height: 18, borderRadius: 4 }} />
        </div>
        <Skeleton.Button active style={{ width: 72, height: 24, borderRadius: 99 }} />
      </div>
      <div className="border-t border-dashed border-gray-200" />
      <div className="flex gap-5">
        <Skeleton.Input active size="small" style={{ width: 100, height: 14, borderRadius: 4 }} />
        <Skeleton.Input active size="small" style={{ width: 60, height: 14, borderRadius: 4 }} />
      </div>
      <Skeleton.Input active style={{ width: '100%', height: 44, borderRadius: 8 }} />
    </div>
    <div className="flex items-center justify-between pl-5 pr-4 py-2.5 bg-gray-50 border-t border-gray-100">
      <div className="flex flex-col gap-1">
        <Skeleton.Input active size="small" style={{ width: 80, height: 10, borderRadius: 4 }} />
        <Skeleton.Input active size="small" style={{ width: 100, height: 10, borderRadius: 4 }} />
      </div>
      <div className="flex gap-1.5">
        <Skeleton.Button active style={{ width: 64, height: 28, borderRadius: 6 }} />
        <Skeleton.Button active style={{ width: 64, height: 28, borderRadius: 6 }} />
      </div>
    </div>
  </div>
);

// ── Skeleton Stats ─────────────────────────────────────────────────────────
const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-white border border-gray-100 rounded-xl px-4 py-4 shadow-sm flex flex-col gap-2"
      >
        <Skeleton.Input active size="small" style={{ width: 80, height: 10, borderRadius: 4 }} />
        <Skeleton.Input active style={{ width: 120, height: 28, borderRadius: 4 }} />
        <Skeleton.Input active size="small" style={{ width: 100, height: 10, borderRadius: 4 }} />
      </div>
    ))}
  </div>
);

const SKELETON_COUNT = 6;

// ── Page ───────────────────────────────────────────────────────────────────
const UserDiaryPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [params, setParams] = useState<DiaryFilterParams>(DEFAULT_FILTER);

  const { data, isLoading, isFetching } = useGetAllDiary(
    userId ?? '',
    {
      keyword: params.search || undefined,
      status: params.status || undefined,
      fromtDate: params.fromDate || undefined,
      toDate: params.toDate || undefined,
      page: params.page - 1,
      size: params.pageSize,
      sort:
        params.sortBy === 'date_desc'
          ? 'createdAt,desc'
          : params.sortBy === 'date_asc'
            ? 'createdAt,asc'
            : params.sortBy === 'amount_desc'
              ? 'totalAmount,desc'
              : params.sortBy === 'amount_asc'
                ? 'totalAmount,asc'
                : 'createdAt,desc',
    },
    { placeholderData: (prev: any) => prev }
  );

  const rawOrders: IGetDiaryResponse[] = Array.isArray(data?.data?.content)
    ? data.data.content
    : [];
  const orders = rawOrders.map(mapDiary);
  const total = data?.data?.page?.totalElements ?? 0;
  const totalPages = Math.ceil(total / params.pageSize) || 1;

  const updateFilter = useCallback((patch: Partial<DiaryFilterParams>) => {
    setParams((prev) => ({ ...prev, ...patch, page: 1 }));
  }, []);

  const changePage = useCallback((p: number) => setParams((prev) => ({ ...prev, page: p })), []);
  const resetFilter = useCallback(() => setParams(DEFAULT_FILTER), []);

  const handleView = (d: GetDiaryRes) => navigate(`/diary/${userId}/${d.id}`);
  const handleEdit = (d: GetDiaryRes) => navigate(`/diary/${userId}/${d.id}/edit`);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#C17B3F', boxShadow: '0 4px 14px rgba(193,123,63,.35)' }}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-tight m-0">
                Nhật ký mua hàng
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Quản lý giao dịch & công nợ khách hàng</p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreate(true)}
            style={{ background: '#C17B3F', borderColor: '#C17B3F', fontWeight: 600 }}
          >
            Tạo nhật ký mới
          </Button>
        </div>
        <CreateDiaryModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          userId={userId ?? ''}
        />

        {/* Stats */}
        {isLoading ? <SkeletonStats /> : <DiaryStatsRow data={orders} />}

        {/* Filter */}
        <DiaryFilterBar
          params={params}
          total={total}
          onSearch={(val) => updateFilter({ search: val })}
          onStatusChange={(val) => updateFilter({ status: val || undefined })}
          onSortChange={(val) => updateFilter({ sortBy: val })}
          onDateRangeChange={(from, to) => updateFilter({ fromDate: from, toDate: to })}
          onReset={resetFilter}
        />

        {/* Grid */}
        <div style={{ position: 'relative' }}>
          {/* fetching overlay khi filter/paginate */}
          {isFetching && !isLoading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(249,250,251,0.65)',
                borderRadius: 12,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonDiaryCard key={i} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Empty
                description={<span className="text-gray-400">Không tìm thấy nhật ký nào</span>}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((d) => (
                <DiaryCard key={d.id} diary={d} onView={handleView} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-gray-400">
              Hiển thị {(params.page - 1) * params.pageSize + 1}–
              {Math.min(params.page * params.pageSize, total)} / {total} nhật ký
            </span>
            <div className="flex items-center gap-2">
              <Select
                value={params.pageSize}
                onChange={(val) => updateFilter({ pageSize: val, page: 1 })}
                style={{ width: 110 }}
                options={PAGE_SIZE_OPTIONS.map((n) => ({ value: n, label: `${n} / trang` }))}
                popupMatchSelectWidth={false}
              />
              <button
                disabled={params.page <= 1}
                onClick={() => changePage(params.page - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ‹
              </button>
              <div
                className="h-8 min-w-[36px] px-3 flex items-center justify-center rounded-lg border-2 bg-white text-sm font-bold"
                style={{ borderColor: '#C17B3F', color: '#C17B3F' }}
              >
                {params.page}
              </div>
              <button
                disabled={params.page >= totalPages}
                onClick={() => changePage(params.page + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDiaryPage;
