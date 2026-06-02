import React from "react";
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { GetDiaryDetailRes } from "../diaryDetail";

interface DiaryInfoCardsProps {
  data: GetDiaryDetailRes;
}

const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const [, m, d] = iso.split("-");
  const date = new Date(iso);
  return `${d}/${m}/${date.getFullYear()}`;
};

const fmtDateTime = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const DiaryInfoCards: React.FC<DiaryInfoCardsProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<ShoppingOutlined className="text-orange-500 text-lg" />}
          label="Số sản phẩm"
          value={`${data.items?.length ?? 0} loại`}
          bg="bg-orange-50"
        />
        <StatCard
          icon={<DollarOutlined className="text-emerald-600 text-lg" />}
          label="Tổng tiền"
          value={fmtVND(data.totalAmount)}
          bg="bg-emerald-50"
          valueClass="text-emerald-700"
        />
        <StatCard
          icon={<CalendarOutlined className="text-amber-500 text-lg" />}
          label="Ngày giao dịch"
          value={fmtDate(data.diaryDate)}
          bg="bg-amber-50"
          valueClass="text-amber-700"
        />
        <StatCard
          icon={<CalendarOutlined className="text-gray-400 text-lg" />}
          label="Cập nhật lúc"
          value={fmtDateTime(data.updatedAt)}
          bg="bg-gray-50"
          valueClass="text-gray-500 text-xs"
        />
      </div>

      {/* Info grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          <InfoItem
            icon={<UserOutlined className="text-orange-400" />}
            label="Người tạo"
            value={data.createdBy}
          />
          <InfoItem
            icon={<CalendarOutlined className="text-orange-400" />}
            label="Ngày tạo"
            value={fmtDateTime(data.createdAt)}
          />
          <InfoItem
            icon={<CalendarOutlined className="text-gray-300" />}
            label="Cập nhật lúc"
            value={fmtDateTime(data.updatedAt)}
            muted
          />
        </div>

        {/* Note */}
        {data.note && (
          <div className="mt-5 flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
            <FileTextOutlined className="text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-orange-500 font-medium mb-0.5">Ghi chú</p>
              <p className="text-sm text-orange-800 leading-relaxed">{data.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Sub components ── */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  valueClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bg, valueClass = "text-gray-800" }) => (
  <div className={`${bg} border border-black/[0.04] rounded-xl p-4 flex flex-col gap-2`}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
    <p className={`font-bold text-sm leading-tight ${valueClass}`}>{value}</p>
  </div>
);

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, muted }) => (
  <div className="flex items-start gap-2.5">
    <span className="mt-0.5 flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-medium truncate ${muted ? "text-gray-400" : "text-gray-800"}`}>
        {value || "—"}
      </p>
    </div>
  </div>
);

export default DiaryInfoCards;