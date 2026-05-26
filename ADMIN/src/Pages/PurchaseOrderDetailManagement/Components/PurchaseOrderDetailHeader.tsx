import React from "react";
import { Button } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { STATUS_CONFIG } from "@/Pages/PurchaseOrderManagement/mockdata";
import { PurchaseOrderStatus } from "@/Pages/PurchaseOrderManagement/purchaseOrder";

interface PODetailHeaderProps {
  data: {
    poCode: string;
    status: string;
  };
  onBack?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onCancel?: () => void;
  onPrint?: () => void;
}

const PODetailHeader: React.FC<PODetailHeaderProps> = ({
  data,
  onBack,
  onEdit,
  onApprove,
  onCancel,
  onPrint,
}) => {
  const cfg =
    STATUS_CONFIG[data.status as PurchaseOrderStatus] ??
    STATUS_CONFIG[PurchaseOrderStatus.DRAFT];

  return (
    <div className="flex flex-col gap-4">
      {/* Back + actions row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium"
        >
          <ArrowLeftOutlined />
          Quay lại danh sách
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button icon={<PrinterOutlined />} onClick={onPrint} style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
            In phiếu
          </Button>
          <Button icon={<EditOutlined />} onClick={onEdit} style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
            Chỉnh sửa
          </Button>
          {data.status === "PENDING" && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={onApprove}
              style={{ background: "#059669", borderColor: "#059669" }}
            >
              Duyệt phiếu
            </Button>
          )}
          {(data.status === "PENDING" || data.status === "DRAFT") && (
            <Button danger icon={<CloseCircleOutlined />} onClick={onCancel}>
              Huỷ phiếu
            </Button>
          )}
        </div>
      </div>

      {/* Title row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-mono mb-1">
            Phiếu nhập kho
          </p>
          <h1
            className="font-bold text-gray-900"
            style={{ fontSize: 26, fontFamily: "monospace", letterSpacing: "-0.02em", lineHeight: 1.2 }}
          >
            {data.poCode}
          </h1>
        </div>
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
      </div>
    </div>
  );
};

export default PODetailHeader;