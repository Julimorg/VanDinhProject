import React from "react";
import {
  ShopOutlined,
  UserOutlined,
  CalendarOutlined,
  InboxOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { formatCurrency, formatDate, formatDateTime } from "../data";

interface POInfoCardsProps {
  data: {
    supplierName: string;
    createdBy: string;
    totalPrice: number;
    totalQuantity: number;
    orderDate: string;
    receivedDate: string;
    createAt: string;
    updateAt: string;
    note: string;
  };
}

const POInfoCards: React.FC<POInfoCardsProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<InboxOutlined style={{ fontSize: 20, color: "#4F46E5" }} />}
          label="Tổng số lượng"
          value={`${data.totalQuantity} sản phẩm`}
          bg="#EEF2FF"
        />
        <StatCard
          icon={<DollarOutlined style={{ fontSize: 20, color: "#059669" }} />}
          label="Tổng tiền"
          value={formatCurrency(data.totalPrice)}
          bg="#ECFDF5"
          valueColor="#059669"
        />
        <StatCard
          icon={<CalendarOutlined style={{ fontSize: 20, color: "#D97706" }} />}
          label="Ngày đặt hàng"
          value={formatDate(data.orderDate)}
          bg="#FFFBEB"
          valueColor="#D97706"
        />
        <StatCard
          icon={<CalendarOutlined style={{ fontSize: 20, color: "#64748B" }} />}
          label="Ngày nhận hàng"
          value={formatDate(data.receivedDate)}
          bg="#F8FAFC"
          valueColor="#64748B"
        />
      </div>

      {/* Info grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
        <InfoItem icon={<ShopOutlined className="text-indigo-400" />} label="Nhà cung cấp"  value={data.supplierName} />
        <InfoItem icon={<UserOutlined className="text-indigo-400" />}  label="Tạo bởi"       value={data.createdBy} />
        <InfoItem icon={<CalendarOutlined className="text-indigo-400" />} label="Ngày tạo"   value={formatDateTime(data.createAt)} />
        <InfoItem icon={<CalendarOutlined className="text-gray-300" />}   label="Cập nhật lúc" value={formatDateTime(data.updateAt)} muted />
        <InfoItem icon={<CalendarOutlined className="text-gray-300" />}   label="Ngày nhận"    value={formatDate(data.receivedDate)} muted />

        {data.note && (
          <div className="sm:col-span-2 lg:col-span-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
            <FileTextOutlined className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-amber-500 font-medium mb-0.5">Ghi chú</p>
              <p className="text-sm text-amber-800 leading-relaxed">{data.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bg, valueColor = "#1E293B" }) => (
  <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: bg, border: "1px solid rgba(0,0,0,0.04)" }}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
    <p className="font-bold text-sm leading-tight" style={{ color: valueColor }}>
      {value}
    </p>
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

export default POInfoCards;