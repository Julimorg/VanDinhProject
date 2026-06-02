import React from "react";
import { Button } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { DiaryStatus, STATUS_CONFIG } from "../diaryDetail";

interface DiaryDetailHeaderProps {
  data: {
    diaryName: string;
    diaryStatus: DiaryStatus;
    diaryDate: string;
  };
  onBack?: () => void;
  onEdit?: () => void;
  onMarkPaid?: () => void;
  onCancel?: () => void;
  onPrint?: () => void;
}

const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const DiaryDetailHeader: React.FC<DiaryDetailHeaderProps> = ({
  data, onBack, onEdit, onMarkPaid, onCancel, onPrint,
}) => {
  const sc = STATUS_CONFIG[data.diaryStatus] ?? STATUS_CONFIG[DiaryStatus.UNPAID];
  const canMarkPaid = data.diaryStatus === DiaryStatus.UNPAID || data.diaryStatus === DiaryStatus.PARTIAL;
  const canCancel   = data.diaryStatus !== DiaryStatus.CANCELLED && data.diaryStatus !== DiaryStatus.PAID;

  return (
    <div className="flex flex-col gap-4">
      {/* Back + actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors bg-transparent border-none cursor-pointer p-0"
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
          {canMarkPaid && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={onMarkPaid}
              style={{ background: "#2D7D5B", borderColor: "#2D7D5B" }}
            >
              Đánh dấu đã thanh toán
            </Button>
          )}
          {canCancel && (
            <Button danger icon={<CloseCircleOutlined />} onClick={onCancel}>
              Huỷ nhật ký
            </Button>
          )}
        </div>
      </div>

      {/* Title + status */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
            Nhật ký · {fmtDate(data.diaryDate)}
          </p>
          <h1 className="text-2xl font-bold text-gray-800 leading-tight m-0">
            {data.diaryName}
          </h1>
        </div>
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold flex-shrink-0"
          style={{ color: sc.color, background: sc.bg }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: sc.dot }} />
          {sc.label}
        </span>
      </div>
    </div>
  );
};

export default DiaryDetailHeader;