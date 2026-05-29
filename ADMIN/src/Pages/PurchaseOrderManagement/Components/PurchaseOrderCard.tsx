import React from "react";
import { Button, Popconfirm } from "antd";
import {
  CalendarOutlined, UserOutlined, ShopOutlined,
  FileTextOutlined, EyeOutlined, DeleteOutlined,
} from "@ant-design/icons";
import { Order, PurchaseOrderStatus } from "@/Types/inventory/purchaseOrderTypes";
import InfoRow from "./InforRows";
import { STATUS_CONFIG } from "@/Constant/inventory-contants";
import { formatToVietnamTime } from "@/Utils/ulti";
import { useDeletePurchaseOrder } from "../Hooks/useDeletePurchaseOrder";

interface Props {
  order: Order;
  onView?: (o: Order) => void;
  onDelete?: (o: Order) => void;  
}

const PurchaseOrderCard: React.FC<Props> = ({ order, onView, onDelete }) => {
  const statusCfg = STATUS_CONFIG[order.status as PurchaseOrderStatus];
  const { mutate: deletePO, isPending: isDeleting } = useDeletePurchaseOrder();
  return (
    <div
      className="transition-all duration-200 hover:-translate-y-1"
      style={{
        position: "relative", display: "flex", flexDirection: "column",
        background: "#FEFDE8", borderRadius: 4, minHeight: 320, overflow: "hidden",
        boxShadow: "2px 3px 8px rgba(0,0,0,0.13), -1px 0 0 rgba(0,0,0,0.04)",
      }}
    >
      {/* Folded corner */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "22px 22px 0 0", borderColor: "transparent #E8E7C8 transparent transparent", zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 22, height: 22, background: "#D6D4A0", clipPath: "polygon(0 100%, 100% 0, 0 0)", zIndex: 1 }} />

      {/* Top accent */}
      <div style={{ height: 5, background: "linear-gradient(90deg,#4F46E5,#7C3AED)" }} />

      {/* Body */}
      <div style={{ padding: "16px 18px 14px 18px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div>
            <p style={{ fontSize: 9, color: "#9CA3AF", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              Phiếu nhập kho
            </p>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1E293B", fontFamily: "monospace", letterSpacing: "-0.01em", margin: 0 }}>
              {order.poCode}
            </h3>
          </div>
          {statusCfg && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 20, background: statusCfg.bg, fontSize: 11, fontWeight: 600, color: statusCfg.text, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusCfg.dot, display: "inline-block" }} />
              {statusCfg.label}
            </span>
          )}
        </div>

        <div style={{ borderTop: "1.5px dashed #D1C97A" }} />

        {/* Info rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <InfoRow icon={<ShopOutlined />}     label="Nhà cung cấp"   value={order.supplierName} />
          <InfoRow icon={<UserOutlined />}     label="Tạo bởi"        value={order.createBy} />
          <InfoRow icon={<CalendarOutlined />} label="Ngày đặt hàng"  value={formatToVietnamTime(order.orderDate)} />
          <InfoRow
            icon={<CalendarOutlined style={{ color: "#C4C4A0" }} />}
            label="Ngày tạo"
            value={formatToVietnamTime(order.createdAt)}
            muted
          />
        </div>

        {/* Note */}
        {order.note && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(253,230,138,0.45)", border: "1px solid #FCD34D", borderRadius: 7, padding: "8px 11px" }}>
            <FileTextOutlined style={{ color: "#D97706", fontSize: 12, marginTop: 1, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.55, margin: 0 }}>{order.note}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", borderTop: "1px dashed #D1C97A", background: "rgba(0,0,0,0.018)" }}>
        <Button
          icon={<EyeOutlined />}
          size="middle"
          onClick={() => onView?.(order)}
          style={{ flex: 1, borderColor: "#D1C97A", color: "#4B5563", background: "transparent" }}
        >
          Xem
        </Button>

        <Popconfirm
          title="Xoá phiếu nhập kho?"
          description="Hành động này không thể hoàn tác. Phiếu sẽ bị xoá vĩnh viễn."
          onConfirm={() => deletePO(order.purchaseOrderId)}
          okText="Xoá"
          cancelText="Huỷ"
          okButtonProps={{ danger: true }}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            size="middle"
            style={{ flex: 1 }}
          >
            Xoá
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default PurchaseOrderCard;