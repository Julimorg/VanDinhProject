import React from "react";
import { Button, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, FileTextOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { GetDiaryRes, DiaryStatus, STATUS_CONFIG } from "../Hooks/diary";

interface DiaryCardProps {
  diary: GetDiaryRes;
  onView?: (diary: GetDiaryRes) => void;
  onEdit?: (diary: GetDiaryRes) => void;
}

const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const fmtDateTime = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const BAR_COLOR: Record<DiaryStatus, string> = {
  PAID:      "#2D7D5B",
  UNPAID:    "#C0392B",
};

const DiaryCard: React.FC<DiaryCardProps> = ({ diary, onView, onEdit }) => {
  const sc       = STATUS_CONFIG[diary.diaryStatus as DiaryStatus] ?? STATUS_CONFIG[DiaryStatus.PAID];
  const barColor = BAR_COLOR[diary.diaryStatus as DiaryStatus] ?? "#94A3B8";

  return (
    <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: barColor }}
      />

      {/* Body */}
      <div className="flex flex-col gap-2.5 flex-1 pl-5 pr-4 pt-4 pb-3">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-800 leading-snug line-clamp-2">
              {diary.diaryName}
            </h3>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0"
            style={{ color: sc.color, background: sc.bg }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
            {sc.label}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200" />

        {/* Metrics */}
        <div className="flex gap-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tổng tiền</span>
            <span className="text-sm font-bold text-emerald-700">{fmtVND(diary.totalAmount)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Số lượng</span>
            <span className="text-sm font-bold text-gray-800">{diary.totalQuantity} sp</span>
          </div>
        </div>

        {/* Note */}
        {diary.note && (
          <div className="flex items-start gap-1.5 bg-orange-50 rounded-lg px-2.5 py-2">
            <FileTextOutlined className="text-orange-400 text-[11px] mt-0.5 flex-shrink-0" />
            <span className="text-[11px] text-orange-700 leading-relaxed line-clamp-2">
              {diary.note}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pl-5 pr-4 py-2.5 bg-gray-50 border-t border-gray-100 flex-shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <UserOutlined className="text-[10px]" /> {diary.createdBy}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <CalendarOutlined className="text-[10px]" /> {fmtDateTime(diary.createdAt)}
          </span>
        </div>
        <div className="flex gap-1.5">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onView?.(diary)}
            className="text-gray-500 border-gray-200 hover:text-orange-600 hover:border-orange-300"
          >
            Xem
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(diary)}
            style={{ background: "#C17B3F", borderColor: "#C17B3F" }}
          >
            Sửa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiaryCard;