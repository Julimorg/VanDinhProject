import React from "react";
import { Skeleton } from "antd";

const SkeletonCard: React.FC = () => (
  <div
    style={{
      background: "#FEFDE8",
      borderRadius: 4,
      boxShadow: "2px 3px 8px rgba(0,0,0,0.13)",
      minHeight: 320,
      overflow: "hidden",
    }}
  >
    <div style={{ height: 5, background: "linear-gradient(90deg,#C7C3F5,#D8B4FE)" }} />
    <div style={{ padding: "16px 18px 14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton.Input active size="small" style={{ width: 80,  height: 10, borderRadius: 4 }} />
      <Skeleton.Input active style={{ width: 140, height: 20, borderRadius: 4 }} />
      <div style={{ borderTop: "1.5px dashed #D1C97A" }} />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Skeleton.Avatar active size={16} shape="circle" style={{ flexShrink: 0 }} />
          <Skeleton.Input active size="small" style={{ flex: 1, height: 14, borderRadius: 4 }} />
        </div>
      ))}
      <Skeleton.Input active style={{ width: "100%", height: 52, borderRadius: 7 }} />
    </div>
    <div style={{ padding: "11px 18px", borderTop: "1px dashed #D1C97A", display: "flex", gap: 10 }}>
      <Skeleton.Button active style={{ flex: 1, height: 36, borderRadius: 6 }} />
      <Skeleton.Button active style={{ flex: 1, height: 36, borderRadius: 6 }} />
    </div>
  </div>
);

export default SkeletonCard;