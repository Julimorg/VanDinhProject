import React from "react";

interface SectionLabelProps {
  text: string;
  light?: boolean;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ text, light = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
    <div style={{ width: 32, height: 1, background: "#c17f3a", flexShrink: 0 }} />
    <span
      style={{
        fontSize: 10,
        letterSpacing: 4,
        textTransform: "uppercase" as const,
        color: light ? "#d4a96a" : "#c17f3a",
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  </div>
);

export default SectionLabel;