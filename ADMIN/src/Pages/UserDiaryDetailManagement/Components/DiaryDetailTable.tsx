import React, { useState } from "react";
import { Table, Tag, Tooltip, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { GetListItemsDiary } from "../diaryDetail";

interface DiaryItemsTableProps {
  items: GetListItemsDiary[];
  // onAddItem: gọi API khi tích hợp
  onAddItem?: () => void;
}

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const COLOR_MAP: Record<string, string> = {
  "trắng ngà": "#FFF8DC", "trắng": "#F8F8F8",
  "xám xi măng": "#8E9BAA", "xám": "#9CA3AF",
  "xanh dương": "#3B82F6", "xanh lá": "#22C55E",
  "đỏ": "#EF4444", "vàng": "#EAB308",
  "đen": "#1E293B", "nâu": "#92400E",
};

const colorDot = (name: string): string => {
  const k = (name ?? "").toLowerCase();
  for (const [n, c] of Object.entries(COLOR_MAP)) {
    if (k.includes(n)) return c;
  }
  return "#E5E7EB";
};

const DiaryItemsTable: React.FC<DiaryItemsTableProps> = ({ items, onAddItem }) => {
  const [search, setSearch] = useState("");

  const filtered = items.filter(it => {
    const q = search.toLowerCase();
    return !q ||
      it.productName.toLowerCase().includes(q) ||
      it.color?.toLowerCase().includes(q) ||
      it.volume?.toLowerCase().includes(q);
  });

  const columns: ColumnsType<GetListItemsDiary> = [
    {
      title: "#",
      key: "index",
      width: 48,
      align: "center",
      render: (_, __, idx) => (
        <span className="text-xs text-gray-400 font-mono">{String(idx + 1).padStart(2, "0")}</span>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      minWidth: 200,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-gray-800 leading-tight">{row.productName}</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400 font-mono">{row.productId}</span>
            {row.volume && (
              <Tag style={{ fontSize: 10, padding: "0 5px", lineHeight: "16px", borderRadius: 4, margin: 0, background: "#FFF7ED", color: "#C17B3F", borderColor: "#FED7AA" }}>
                {row.volume}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: 130,
      render: (val: string) => (
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
            style={{ background: colorDot(val) }}
          />
          <span className="text-sm text-gray-600">{val || "—"}</span>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 90,
      align: "center",
      render: (val: number) => (
        <span className="font-bold text-base" style={{ color: "#C17B3F" }}>{val}</span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 140,
      align: "right",
      render: (val: number) => (
        <span className="text-sm font-medium text-gray-700">{fmtVND(val)}</span>
      ),
    },
    {
      title: "Thành tiền",
      key: "subtotal",
      width: 150,
      align: "right",
      render: (_, row) => (
        <span className="text-sm font-bold text-emerald-700">
          {fmtVND(row.unitPrice * row.quantity)}
        </span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "itemNote",
      key: "itemNote",
      width: 160,
      render: (val: string) =>
        val ? (
          <Tooltip title={val}>
            <div className="flex items-center gap-1 cursor-default">
              <FileTextOutlined className="text-orange-400 text-xs" />
              <span className="text-xs text-gray-500 truncate max-w-[120px]">{val}</span>
            </div>
          </Tooltip>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        ),
    },
  ];

  const totalQty = filtered.reduce((s, i) => s + i.quantity, 0);
  const totalAmt = filtered.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-gray-800">Danh sách sản phẩm</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {filtered.length} loại · {totalQty} đơn vị
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

      {/* Table */}
      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ x: 900 }}
        size="middle"
        rowClassName={(_, idx) => idx % 2 === 0 ? "" : "bg-gray-50/50"}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <span className="text-sm font-bold text-gray-700 pl-1">Tổng cộng</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center">
                <span className="font-bold text-base" style={{ color: "#C17B3F" }}>{totalQty}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} />
              <Table.Summary.Cell index={5} align="right">
                <span className="font-bold text-sm text-emerald-700">{fmtVND(totalAmt)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} />
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default DiaryItemsTable;