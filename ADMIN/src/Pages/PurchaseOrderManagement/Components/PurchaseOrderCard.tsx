import React from "react";
import {
  CalendarOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { formatDate, formatDateTime } from "../mockdata";
import { GetPurchaseOrderRes } from "../purchaseOrder";

interface PurchaseOrderCardProps {
  order: GetPurchaseOrderRes;
  onView?: (order: GetPurchaseOrderRes) => void;
  onEdit?: (order: GetPurchaseOrderRes) => void;
}

const PurchaseOrderCard: React.FC<PurchaseOrderCardProps> = ({ order, onView, onEdit }) => {
  return (
    <div
      className="relative flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "#FEFDE8",
        borderRadius: 4,
        boxShadow: "2px 3px 8px rgba(0,0,0,0.13), -1px 0 0 rgba(0,0,0,0.04)",
        minHeight: 320,
      }}
    >
      {/* Folded corner bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "22px 22px 0 0",
          borderColor: "transparent #E8E7C8 transparent transparent",
          filter: "drop-shadow(1px -1px 1px rgba(0,0,0,0.08))",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 22,
          height: 22,
          background: "#D6D4A0",
          clipPath: "polygon(0 100%, 100% 0, 0 0)",
          zIndex: 1,
        }}
      />

      {/* Top colour accent */}
      <div style={{ height: 5, background: "linear-gradient(90deg,#4F46E5,#7C3AED)" }} />

      {/* Body */}
      <div className="flex flex-col gap-3 flex-1" style={{ padding: "16px 18px 14px 18px" }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="uppercase tracking-widest"
              style={{ fontSize: 9, color: "#9CA3AF", fontFamily: "monospace", marginBottom: 4 }}
            >
              Phiếu nhập kho
            </p>
            <h3
              className="font-bold leading-tight"
              style={{ fontSize: 17, color: "#1E293B", fontFamily: "monospace", letterSpacing: "-0.01em" }}
            >
              {order.poCode}
            </h3>
          </div>
          {/* <StatusBadge status={order.status} /> */}
        </div>

        {/* Dashed rule */}
        <div style={{ borderTop: "1.5px dashed #D1C97A" }} />

        {/* Info rows */}
        <div className="flex flex-col" style={{ gap: 9 }}>
          <InfoRow icon={<ShopOutlined />} label="Nhà cung cấp" value={order.supplierName} />
          <InfoRow icon={<UserOutlined />} label="Tạo bởi" value={order.createdBy} />
          <InfoRow icon={<CalendarOutlined />} label="Ngày đặt hàng" value={formatDate(order.orderDate)} />
          <InfoRow
            icon={<CalendarOutlined style={{ color: "#C4C4A0" }} />}
            label="Ngày tạo"
            value={formatDateTime(order.createAt)}
            muted
          />
        </div>

        {/* Note */}
        {order.note && (
          <div
            className="flex items-start gap-2"
            style={{
              background: "rgba(253,230,138,0.45)",
              border: "1px solid #FCD34D",
              borderRadius: 7,
              padding: "8px 11px",
            }}
          >
            <FileTextOutlined style={{ color: "#D97706", fontSize: 12, marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.55, margin: 0 }}>
              {order.note}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-center gap-3"
        style={{
          padding: "11px 18px",
          borderTop: "1px dashed #D1C97A",
          background: "rgba(0,0,0,0.018)",
        }}
      >
        <Button
          icon={<EyeOutlined />}
          size="middle"
          onClick={() => onView?.(order)}
          style={{ flex: 1, borderColor: "#D1C97A", color: "#4B5563", background: "transparent" }}
        >
          Xem
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="middle"
          onClick={() => onEdit?.(order)}
          style={{ flex: 1, background: "#4F46E5", borderColor: "#4F46E5" }}
        >
          Sửa
        </Button>
      </div>
    </div>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, muted }) => (
  <div className="flex items-center gap-2 min-w-0">
    <span style={{ fontSize: 13, color: muted ? "#C4C4A0" : "#6366F1", flexShrink: 0 }}>{icon}</span>
    <span style={{ fontSize: 12, color: muted ? "#BCBCA0" : "#6B7280", flexShrink: 0, whiteSpace: "nowrap" }}>
      {label}:
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: muted ? "#ABABAB" : "#1E293B",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flex: 1,
        minWidth: 0,
      }}
      title={value}
    >
      {value}
    </span>
  </div>
);

export default PurchaseOrderCard;