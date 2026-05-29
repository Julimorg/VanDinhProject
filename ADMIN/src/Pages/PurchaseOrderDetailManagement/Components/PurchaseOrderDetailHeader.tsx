// components/PODetailHeader.tsx
import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import {
  ArrowLeftOutlined, EditOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  PrinterOutlined, InboxOutlined,
} from "@ant-design/icons";
import { useExportPurchasePDF } from "../Hooks/useGetPurchaseOrderPdfFile";
import { useReceivePurchaseOrder } from "../Hooks/useReceivedPurchaseOrder";
import POEditModal from "./UpdatePurchaseOrderModal";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  DRAFT:     { label: "Nháp",       color: "#6B7280", bg: "#F3F4F6", dot: "#9CA3AF" },
  RECEIVED:  { label: "Đã nhận",   color: "#065F46", bg: "#D1FAE5", dot: "#10B981" },
};

interface PODetailHeaderProps {
  data: {
    id: string;
    poCode: string;
    supplierName: string;
    note: string;
    status: string;
  };
  onBack?: () => void;
  onApprove?: () => void;
  onCancel?: () => void;
}

const PODetailHeader: React.FC<PODetailHeaderProps> = ({
  data, onBack, onApprove, onCancel,
}) => {
  const cfg = STATUS_CONFIG[data.status] ?? STATUS_CONFIG["DRAFT"];
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: exportPDF, isPending: isExporting } = useExportPurchasePDF();
  const { mutate: receivePO, isPending: isReceiving } = useReceivePurchaseOrder();

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <ArrowLeftOutlined />
            Quay lại danh sách
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* In phiếu */}
            <Button
              icon={<PrinterOutlined />}
              onClick={() => exportPDF(data.id)}
              loading={isExporting}
              disabled={isExporting}
              style={{ borderColor: "#E2E8F0", color: "#64748B" }}
            >
              {isExporting ? "Đang xuất..." : "In phiếu"}
            </Button>

            {/* Chỉnh sửa — chỉ hiện khi chưa nhận/huỷ */}
            {!["RECEIVED", "CANCELLED"].includes(data.status) && (
              <Button
                icon={<EditOutlined />}
                onClick={() => setEditOpen(true)}
                style={{ borderColor: "#E2E8F0", color: "#64748B" }}
              >
                Chỉnh sửa
              </Button>
            )}

            {/* Duyệt phiếu */}
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
            {data.status === "DRAFTED" && (
              <Popconfirm
                title="Xác nhận nhận hàng"
                description="Bạn có chắc đã nhận đủ hàng từ nhà cung cấp?"
                onConfirm={() => receivePO(data.id)}
                okText="Xác nhận"
                cancelText="Huỷ"
                okButtonProps={{ style: { background: '#0F6E56', borderColor: '#0F6E56' } }}
              >
                <Button
                  icon={<InboxOutlined />}
                  loading={isReceiving}
                  style={{
                    background: "#ECFDF5",
                    borderColor: "#10B981",
                    color: "#065F46",
                    fontWeight: 600,
                  }}
                >
                  Đã nhận được hàng
                </Button>
              </Popconfirm> )}
            
            {/* Huỷ phiếu */}
            {(data.status === "PENDING" || data.status === "DRAFT") && (
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={onCancel}
              >
                Huỷ phiếu
              </Button>
            )}
          </div>
        </div>

        {/* Title + Badge */}
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

    
      <POEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={data}
      />
    </>
  );
};

export default PODetailHeader;