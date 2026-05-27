import React from "react";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, muted }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
    <span style={{ fontSize: 13, color: muted ? "#C4C4A0" : "#6366F1", flexShrink: 0 }}>
      {icon}
    </span>
    <span style={{ fontSize: 12, color: muted ? "#BCBCA0" : "#6B7280", flexShrink: 0, whiteSpace: "nowrap" }}>
      {label}:
    </span>
    <span
      title={value}
      style={{
        fontSize: 13, fontWeight: 500,
        color: muted ? "#ABABAB" : "#1E293B",
        overflow: "hidden", textOverflow: "ellipsis",
        whiteSpace: "nowrap", flex: 1, minWidth: 0,
      }}
    >
      {value}
    </span>
  </div>
);

export default InfoRow;