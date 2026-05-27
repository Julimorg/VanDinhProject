import React from "react";
import { Spin } from "antd";
import SkeletonCard from "./SkeletonCard";
import PurchaseOrderCard from "./PurchaseOrderCard";
import { SKELETON_COUNT } from "@/Constant/inventory-contants";
import { Order } from "@/Types/inventory/purchaseOrderTypes";

interface Props {
  orders: Order[];
  loading: boolean;
  isFetching: boolean;
  onView: (o: Order) => void;
  onEdit: (o: Order) => void;
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 16,
};

const PurchaseOrderGrid: React.FC<Props> = ({ orders, loading, isFetching, onView, onEdit }) => {
  if (loading) {
    return (
      <div style={gridStyle}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", color: "#94A3B8", gap: 8 }}>
        <span style={{ fontSize: 40 }}>📭</span>
        <p style={{ fontSize: 14, margin: 0 }}>Không tìm thấy phiếu nhập kho nào</p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Fetching overlay (paginate / filter) */}
      {isFetching && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(244,245,247,0.6)", borderRadius: 8, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin size="large" />
        </div>
      )}
      <div style={gridStyle}>
        {orders.map((order) => (
          <PurchaseOrderCard key={order.purchaseOrderId} order={order} onView={onView} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default PurchaseOrderGrid;