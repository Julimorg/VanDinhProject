import React, { useState, useMemo, useCallback } from "react";
import { ConfigProvider, message, Select, Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PAGE_SIZE_OPTIONS } from "@/Constant/inventory-contants";
import DiaryCard from "./Components/DiaryCard";
import DiaryFilterBar from "./Components/DiaryFilterBar";
import DiaryStatsRow from "./Components/DiaryStat";
import { GetDiaryRes, DiaryStatus, DiaryFilterParams, DEFAULT_FILTER } from "./components/diary";

// Mock data — shape of GetDiaryRes
// Khi tích hợp API: xoá MOCK_DATA, dùng useQuery
const MOCK_DATA: GetDiaryRes[] = [
  { id:"D001", diaryName:"Mua sơn nội thất nhà anh Minh",          diaryStatus:DiaryStatus.PAID,      diaryDate:"2025-05-10", totalAmount:4800000,  totalQuantity:12, note:"Khách thân, bán 90% giá.",         createdBy:"admin",       createdAt:"2025-05-08T09:00:00", updatedAt:"2025-05-10T14:00:00" },
  { id:"D002", diaryName:"Đơn sơn epoxy xưởng chị Lan",            diaryStatus:DiaryStatus.UNPAID,    diaryDate:"2025-05-15", totalAmount:18600000, totalQuantity:8,  note:"Chưa thanh toán, chờ xác nhận.",   createdBy:"nguyen.van.a",createdAt:"2025-05-14T10:30:00", updatedAt:"2025-05-15T08:00:00" },
  { id:"D003", diaryName:"Bột trét + lót chống kiềm anh Hùng",     diaryStatus:DiaryStatus.PARTIAL,   diaryDate:"2025-05-18", totalAmount:3200000,  totalQuantity:20, note:"Đã cọc 1.5tr. Còn lại đợt 2.",     createdBy:"tran.thi.b", createdAt:"2025-05-17T14:00:00", updatedAt:"2025-05-18T16:00:00" },
  { id:"D004", diaryName:"Sơn ngoại thất biệt thự Quận 9",         diaryStatus:DiaryStatus.PAID,      diaryDate:"2025-04-28", totalAmount:24500000, totalQuantity:15, note:"",                                 createdBy:"admin",       createdAt:"2025-04-25T09:00:00", updatedAt:"2025-04-28T18:00:00" },
  { id:"D005", diaryName:"Bộ sơn trang trí tiệm tóc Thu",          diaryStatus:DiaryStatus.UNPAID,    diaryDate:"2025-05-20", totalAmount:2100000,  totalQuantity:6,  note:"Giá đặc biệt vì quen lâu năm.",    createdBy:"le.van.c",   createdAt:"2025-05-20T08:00:00", updatedAt:"2025-05-20T08:00:00" },
  { id:"D006", diaryName:"Sơn nhà trọ dãy 10 phòng",               diaryStatus:DiaryStatus.CANCELLED, diaryDate:"2025-04-15", totalAmount:8900000,  totalQuantity:30, note:"Khách huỷ vì tìm giá rẻ hơn.",     createdBy:"tran.thi.b", createdAt:"2025-04-12T11:00:00", updatedAt:"2025-04-15T09:00:00" },
  { id:"D007", diaryName:"Sơn lại phòng ngủ cô Ba",                diaryStatus:DiaryStatus.PAID,      diaryDate:"2025-05-05", totalAmount:960000,   totalQuantity:4,  note:"",                                 createdBy:"admin",       createdAt:"2025-05-04T15:00:00", updatedAt:"2025-05-05T12:00:00" },
  { id:"D008", diaryName:"Đơn lớn nhà máy Bình Dương",             diaryStatus:DiaryStatus.PARTIAL,   diaryDate:"2025-05-22", totalAmount:52000000, totalQuantity:50, note:"Thanh toán 3 đợt. Đợt 1 đã 20tr.", createdBy:"nguyen.van.a",createdAt:"2025-05-21T09:00:00", updatedAt:"2025-05-22T10:00:00" },
  { id:"D009", diaryName:"Sơn cổng + tường rào anh Dũng",          diaryStatus:DiaryStatus.UNPAID,    diaryDate:"2025-05-25", totalAmount:1850000,  totalQuantity:5,  note:"Bán nợ cuối tháng trả.",           createdBy:"le.van.c",   createdAt:"2025-05-25T07:30:00", updatedAt:"2025-05-25T07:30:00" },
  { id:"D010", diaryName:"Sơn shop thời trang chị Hà",             diaryStatus:DiaryStatus.PAID,      diaryDate:"2025-03-20", totalAmount:6400000,  totalQuantity:18, note:"",                                 createdBy:"admin",       createdAt:"2025-03-18T10:00:00", updatedAt:"2025-03-20T16:00:00" },
  { id:"D011", diaryName:"Sơn văn phòng công ty ABC",              diaryStatus:DiaryStatus.PARTIAL,   diaryDate:"2025-04-10", totalAmount:31000000, totalQuantity:40, note:"Đợt 2 còn 11tr chưa thanh toán.",  createdBy:"nguyen.van.a",createdAt:"2025-04-08T09:00:00", updatedAt:"2025-04-12T14:00:00" },
  { id:"D012", diaryName:"Sơn chống thấm mái nhà ông Tám",         diaryStatus:DiaryStatus.PAID,      diaryDate:"2025-02-14", totalAmount:7200000,  totalQuantity:10, note:"Khách VIP, giá ưu đãi 85%.",       createdBy:"tran.thi.b", createdAt:"2025-02-12T08:00:00", updatedAt:"2025-02-14T17:00:00" },
];

const UserDiaryPage: React.FC = () => {
  const [params, setParams] = useState<DiaryFilterParams>(DEFAULT_FILTER);

  const updateFilter = useCallback((patch: Partial<DiaryFilterParams>) => {
    setParams(prev => ({ ...prev, ...patch, page: 1 }));
  }, []);

  const changePage = useCallback((p: number) => {
    setParams(prev => ({ ...prev, page: p }));
  }, []);

  const resetFilter = useCallback(() => setParams(DEFAULT_FILTER), []);

  const filtered = useMemo(() => {
    const q = params.search.trim().toLowerCase();
    let list = MOCK_DATA.filter(d => {
      const matchSearch = !q ||
        d.diaryName.toLowerCase().includes(q) ||
        d.createdBy.toLowerCase().includes(q) ||
        d.note.toLowerCase().includes(q);
      const matchStatus = !params.status || d.diaryStatus === params.status;
      const matchFrom   = !params.fromDate || d.diaryDate >= params.fromDate;
      const matchTo     = !params.toDate   || d.diaryDate <= params.toDate;
      return matchSearch && matchStatus && matchFrom && matchTo;
    });
    list = [...list].sort((a, b) => {
      if (params.sortBy === "date_desc")   return b.diaryDate.localeCompare(a.diaryDate);
      if (params.sortBy === "date_asc")    return a.diaryDate.localeCompare(b.diaryDate);
      if (params.sortBy === "amount_desc") return b.totalAmount - a.totalAmount;
      if (params.sortBy === "amount_asc")  return a.totalAmount - b.totalAmount;
      return 0;
    });
    return list;
  }, [params]);

  const total      = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));
  const paged      = filtered.slice((params.page - 1) * params.pageSize, params.page * params.pageSize);

  const handleView = (d: GetDiaryRes) => message.info(`Xem: ${d.diaryName}`);
  const handleEdit = (d: GetDiaryRes) => message.info(`Sửa: ${d.diaryName}`);

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#C17B3F", borderRadius: 8 },
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col gap-6">

          {/* ── Header ── */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#C17B3F", boxShadow: "0 4px 14px rgba(193,123,63,.35)" }}
              >
                <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 leading-tight m-0">Nhật ký mua hàng</h1>
                <p className="text-xs text-gray-400 mt-0.5">Quản lý giao dịch & công nợ khách hàng</p>
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#C17B3F", borderColor: "#C17B3F", fontWeight: 600 }}
              onClick={() => message.success("Tạo nhật ký mới")}
            >
              Tạo nhật ký mới
            </Button>
          </div>

          {/* ── Stats ── */}
          <DiaryStatsRow data={MOCK_DATA} />

          {/* ── Filter ── */}
          <DiaryFilterBar
            params={params}
            total={total}
            onSearch={val => updateFilter({ search: val })}
            onStatusChange={val => updateFilter({ status: val })}
            onSortChange={val => updateFilter({ sortBy: val })}
            onDateRangeChange={(from, to) => updateFilter({ fromDate: from, toDate: to })}
            onReset={resetFilter}
          />

          {/* ── Grid ── */}
          {paged.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Empty description={<span className="text-gray-400">Không tìm thấy nhật ký nào</span>} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paged.map(d => (
                <DiaryCard key={d.id} diary={d} onView={handleView} onEdit={handleEdit} />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {total > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-gray-400">
                Hiển thị {(params.page - 1) * params.pageSize + 1}–{Math.min(params.page * params.pageSize, total)} / {total} nhật ký
              </span>
              <div className="flex items-center gap-2">
                <Select
                  value={params.pageSize}
                  onChange={val => updateFilter({ pageSize: val, page: 1 })}
                  style={{ width: 110 }}
                  options={PAGE_SIZE_OPTIONS.map(n => ({ value: n, label: `${n} / trang` }))}
                  popupMatchSelectWidth={false}
                />
                <button
                  disabled={params.page <= 1}
                  onClick={() => changePage(params.page - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >‹</button>
                <div className="h-8 min-w-[36px] px-3 flex items-center justify-center rounded-lg border-2 bg-white text-sm font-bold" style={{ borderColor: "#C17B3F", color: "#C17B3F" }}>
                  {params.page}
                </div>
                <button
                  disabled={params.page >= totalPages}
                  onClick={() => changePage(params.page + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >›</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </ConfigProvider>
  );
};

export default UserDiaryPage;