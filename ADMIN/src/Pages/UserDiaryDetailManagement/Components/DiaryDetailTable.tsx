import React, { useState } from "react";
import { Input, Button, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { GetListItemsDiary } from "../diaryDetail";

interface DiaryItemsTableProps {
  items: GetListItemsDiary[];
  onAddItem?: () => void;
}

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

// Extract date from createAt ISO string → "YYYY-MM-DD"
const toDateKey = (iso: string) => iso?.slice(0, 10) ?? "";

const fmtDateLabel = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const COLOR_MAP: Record<string, string> = {
  "trắng ngà": "#FFF8DC", "trắng": "#F5F5F5",
  "xám xi măng": "#8E9BAA", "xám": "#9CA3AF",
  "xanh dương": "#3B82F6", "xanh lá": "#22C55E",
  "xanh mint": "#6EE7B7",
  "vàng kem": "#FDE68A", "vàng": "#EAB308",
  "đỏ": "#EF4444", "đen": "#1E293B", "nâu": "#92400E",
};

const colorDot = (name: string) => {
  const k = (name ?? "").toLowerCase();
  for (const [n, c] of Object.entries(COLOR_MAP)) {
    if (k.includes(n)) return c;
  }
  return "#E5E7EB";
};

// Group items by date (createAt date)
function groupByDate(items: GetListItemsDiary[]): { date: string; rows: GetListItemsDiary[] }[] {
  const map = new Map<string, GetListItemsDiary[]>();
  for (const item of items) {
    const key = toDateKey(item.createAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, rows]) => ({ date, rows }));
}

const DiaryItemsTable: React.FC<DiaryItemsTableProps> = ({ items, onAddItem }) => {
  const [search, setSearch] = useState("");

  const filtered = items.filter(it => {
    const q = search.toLowerCase();
    return (
      !q ||
      it.productName.toLowerCase().includes(q) ||
      it.color?.toLowerCase().includes(q) ||
      it.volume?.toLowerCase().includes(q)
    );
  });

  const groups = groupByDate(filtered);
  const totalQty = filtered.reduce((s, i) => s + i.quantity, 0);
  const totalAmt = filtered.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  // running index across all groups
  let globalIdx = 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-gray-800">Danh sách sản phẩm</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {filtered.length} sản phẩm · {totalQty} đơn vị
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200, borderRadius: 8 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddItem}
            style={{ background: "#C17B3F", borderColor: "#C17B3F", fontWeight: 600, borderRadius: 8 }}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Grouped table */}
      <div className="overflow-x-auto">
        {groups.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
            Không tìm thấy sản phẩm
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            {groups.map(({ date, rows }) => {
              const dayTotal = rows.reduce((s, r) => s + r.unitPrice * r.quantity, 0);
              const dayQty   = rows.reduce((s, r) => s + r.quantity, 0);

              return (
                <React.Fragment key={date}>
                  {/* Date group header */}
                  <thead>
                    <tr className="bg-blue-50 border-y border-blue-100">
                      <th colSpan={2} className="px-4 py-2.5 text-left">
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" fill="#3B82F6" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z"/>
                          </svg>
                          <span className="text-sm font-bold text-blue-600">{fmtDateLabel(date)}</span>
                          <span className="text-xs text-gray-400">{rows.length} sản phẩm</span>
                        </div>
                      </th>
                      <th colSpan={3} className="px-4 py-2.5 text-left">
                        <tr className="hidden sm:contents">
                          <th className="w-44 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left pr-4">Phân loại</th>
                          <th className="w-28 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right pr-4">Đơn giá</th>
                          <th className="w-10 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">SL</th>
                        </tr>
                      </th>
                      <th className="px-4 py-2.5 text-right">
                        <span className="text-xs text-gray-500">Cộng ngày:</span>
                        <span className="text-sm font-bold text-blue-600 ml-1">{fmtVND(dayTotal)}</span>
                      </th>
                      <th className="px-4 py-2.5" />
                    </tr>
                    {/* Column headers per group */}
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      <th className="w-10 px-4 py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                      <th className="w-48 px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Phân loại</th>
                      <th className="w-32 px-4 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Đơn giá</th>
                      <th className="w-12 px-4 py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">SL</th>
                      <th className="w-36 px-4 py-2 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Thành Tiền</th>
                      <th className="w-40 px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ghi chú</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row) => {
                      globalIdx += 1;
                      const currentIdx = globalIdx;
                      const subtotal = row.unitPrice * row.quantity;
                      const dot = colorDot(row.color);
                      const hasColor = !!row.color;

                      return (
                        <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                          {/* # */}
                          <td className="px-4 py-3.5 text-center">
                            <span className="text-xs text-gray-400">{currentIdx}</span>
                          </td>

                          {/* Product */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              {/* Product image placeholder */}
                              <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                <svg width="18" height="18" fill="none" stroke="#D1D5DB" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <path d="M21 15l-5-5L5 21"/>
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-800 leading-tight truncate">{row.productName}</p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{row.productId}</p>
                              </div>
                            </div>
                          </td>

                          {/* Phân loại: color chip + volume tag */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {hasColor && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-gray-200 bg-white text-xs text-gray-600">
                                  <span
                                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0 border border-black/10"
                                    style={{ background: dot }}
                                  />
                                  {row.color}
                                </span>
                              )}
                              {row.volume && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-xs text-gray-500 font-medium">
                                  {row.volume}
                                </span>
                              )}
                              {!hasColor && !row.volume && (
                                <span className="text-xs text-gray-300">—</span>
                              )}
                            </div>
                          </td>

                          {/* Đơn giá */}
                          <td className="px-4 py-3.5 text-right">
                            <span className="text-sm text-gray-700">{fmtVND(row.unitPrice)}</span>
                          </td>

                          {/* SL */}
                          <td className="px-4 py-3.5 text-center">
                            <span className="text-sm font-semibold text-gray-800">{row.quantity}</span>
                          </td>

                          {/* Thành tiền */}
                          <td className="px-4 py-3.5 text-right">
                            <span className="text-sm font-bold text-blue-600">{fmtVND(subtotal)}</span>
                          </td>

                          {/* Ghi chú */}
                          <td className="px-4 py-3.5">
                            {row.itemNote ? (
                              <Tooltip title={row.itemNote}>
                                <span className="text-sm text-gray-500 truncate block max-w-[150px] cursor-default">
                                  {row.itemNote}
                                </span>
                              </Tooltip>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </React.Fragment>
              );
            })}

            {/* Grand total footer */}
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-200">
                <td colSpan={4} className="px-4 py-3">
                  <span className="text-sm font-bold text-gray-700">Tổng cộng</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-bold text-gray-800">{totalQty}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-bold text-emerald-700">{fmtVND(totalAmt)}</span>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default DiaryItemsTable;