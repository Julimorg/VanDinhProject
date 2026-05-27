import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import {
  InboxOutlined, InfoCircleOutlined, ShopOutlined,
  UserOutlined, FileTextOutlined, BarcodeOutlined,
  CheckOutlined, CalendarOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { ICreatePurchaseOrderRequest } from "@/Interface/Inventory/CreatePurchaseOrder";
import { useCreatePurchaseOrder } from "../Hooks/useCreatePurchaseOrder";

type CreatePurchaseOrderReq = ICreatePurchaseOrderRequest;
type FieldErrors = Partial<Record<keyof CreatePurchaseOrderReq, string>>;

const EMPTY_FORM = (): CreatePurchaseOrderReq => ({
  poCode: "",
  supplierName: "",
  note: "",
});

const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

interface CreatePurchaseOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // callback để refetch list sau khi tạo thành công
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<CreatePurchaseOrderReq>(EMPTY_FORM());
  const [errors, setErrors] = useState<FieldErrors>({});

  const { mutate, isPending } = useCreatePurchaseOrder({
    onSuccess: (res) => {
      toast.success(
        `✅ Tạo phiếu thành công! Mã phiếu: ${res.data.poCode}`,
        { position: "top-right", autoClose: 3000 }
      );
      handleClose();
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ?? "Tạo phiếu thất bại, vui lòng thử lại.";
      toast.error(`❌ ${msg}`, { position: "top-right", autoClose: 4000 });
    },
  });

  const update = (field: keyof CreatePurchaseOrderReq, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.supplierName.trim()) e.supplierName = "Vui lòng nhập nhà cung cấp";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    mutate(form);
  };

  const handleClose = () => {
    setForm(EMPTY_FORM());
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={820}
      centered
      styles={{
        content: { padding: 0, borderRadius: 18, overflow: "hidden" },
        header: { padding: "16px 24px 14px", borderBottom: "1px solid #F1F5F9", marginBottom: 0 },
        body: { padding: 0, display: "flex", height: 520 },
        footer: { padding: "12px 24px", borderTop: "1px solid #F1F5F9", marginTop: 0 },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <InboxOutlined style={{ color: "#4F46E5", fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Tạo phiếu nhập kho</div>
            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 400 }}>
              Điền thông tin bên trái, xem trước phiếu bên phải
            </div>
          </div>
        </div>
      }
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={handleClose} disabled={isPending}>Huỷ</Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleConfirm}
            loading={isPending}
            style={{ background: "#4F46E5", borderColor: "#4F46E5", fontWeight: 600 }}
          >
            Tạo phiếu
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", height: "100%" }}>
        {/* ── LEFT: Form ── */}
        <div style={{ width: 380, flexShrink: 0, borderRight: "1px solid #F1F5F9", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <SectionTitle>Thông tin phiếu</SectionTitle>

          <FieldRow label="Mã phiếu (PO Code)" hint="Để trống hệ thống sẽ tự sinh mã">
            <Input
              prefix={<BarcodeOutlined style={{ color: "#94A3B8" }} />}
              placeholder="VD: PO-2025-0013"
              value={form.poCode}
              onChange={(e) => update("poCode", e.target.value)}
              maxLength={30}
              style={{ borderRadius: 8 }}
            />
          </FieldRow>

          <FieldRow label="Nhà cung cấp" required error={errors.supplierName}>
            <Input
              prefix={<ShopOutlined style={{ color: "#94A3B8" }} />}
              placeholder="Nhập tên nhà cung cấp"
              value={form.supplierName}
              onChange={(e) => update("supplierName", e.target.value)}
              status={errors.supplierName ? "error" : ""}
              maxLength={100}
              style={{ borderRadius: 8 }}
            />
          </FieldRow>

          <FieldRow label="Ghi chú">
            <Input.TextArea
              placeholder="Ghi chú thêm cho phiếu này..."
              rows={4}
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              maxLength={255}
              showCount
              style={{ borderRadius: 8, resize: "none" }}
            />
          </FieldRow>
        </div>

        {/* ── RIGHT: Preview ── */}
        <div style={{ flex: 1, background: "linear-gradient(135deg,#EEF2FF 0%,#F4F5F7 60%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(79,70,229,.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(124,58,237,.05)", pointerEvents: "none" }} />
          <TicketPreview form={form} />
        </div>
      </div>
    </Modal>
  );
};

/* ── Ticket Preview ── */
const TicketPreview: React.FC<{ form: CreatePurchaseOrderReq }> = ({ form }) => {
  const poCode = form.poCode || "PO-XXXX-XXXX";
  const isEmpty = !form.supplierName && !form.note && !form.poCode;

  return (
    <div style={{ width: 300, flexShrink: 0, background: "#FEFDE8", borderRadius: 6, boxShadow: "3px 4px 12px rgba(0,0,0,.14), -1px 0 0 rgba(0,0,0,.04)", overflow: "hidden", position: "relative" }}>
      <div style={{ height: 5, background: "linear-gradient(90deg,#4F46E5,#7C3AED)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "26px 26px 0 0", borderColor: "transparent #E0DDA0 transparent transparent", zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 26, height: 26, background: "#D4D190", clipPath: "polygon(0 100%,100% 0,0 0)", zIndex: 1 }} />
      <div style={{ position: "absolute", left: 7, top: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid #C8C47A" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid #C8C47A" }} />
      </div>

      <div style={{ padding: "22px 24px 28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "#9CA3AF", fontFamily: "monospace", marginBottom: 6 }}>
            Phiếu nhập kho
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: form.poCode ? "#1E293B" : "#C4C4A0", letterSpacing: "-.01em", lineHeight: 1.2 }}>
            {poCode}
          </div>
        </div>

        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, background: "#F3F4F6", color: "#6B7280", fontSize: 12, fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#9CA3AF" }} />
            Nháp
          </span>
        </div>

        <div style={{ borderTop: "1.5px dashed #D1C97A" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TicketRow icon={<ShopOutlined style={{ color: "#6366F1", fontSize: 14 }} />} label="Nhà cung cấp" value={form.supplierName} placeholder="Chưa nhập" />
          <TicketRow icon={<CalendarOutlined style={{ color: "#9CA3AF", fontSize: 14 }} />} label="Ngày tạo" value={today()} muted />
        </div>

        {form.note ? (
          <div style={{ background: "rgba(253,230,138,.45)", border: "1px solid #FCD34D", borderRadius: 9, padding: "10px 13px", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <FileTextOutlined style={{ color: "#D97706", fontSize: 13, marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {form.note}
            </span>
          </div>
        ) : (
          <div style={{ border: "1.5px dashed #E0DDA0", borderRadius: 9, padding: "10px 13px", display: "flex", gap: 8, alignItems: "center" }}>
            <FileTextOutlined style={{ color: "#D1C97A", fontSize: 13, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#C4C4A0", fontStyle: "italic" }}>Chưa có ghi chú</span>
          </div>
        )}

        {isEmpty && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 3 }}>
            <div style={{ fontSize: 11, color: "#C4C4A0", fontStyle: "italic", textAlign: "center", lineHeight: 1.6, padding: "0 20px" }}>
              Điền thông tin bên trái<br />để xem trước phiếu
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Helpers ── */
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".1em", paddingBottom: 8, borderBottom: "1px solid #F1F5F9" }}>
    {children}
  </div>
);

const FieldRow: React.FC<{ label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode }> = ({ label, required, hint, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{label}</span>
      {required && <span style={{ color: "#EF4444", fontSize: 12 }}>*</span>}
    </div>
    {hint && <span style={{ fontSize: 11, color: "#94A3B8", marginTop: -3 }}>{hint}</span>}
    {children}
    {error && (
      <div style={{ fontSize: 11, color: "#EF4444", display: "flex", alignItems: "center", gap: 3 }}>
        <InfoCircleOutlined style={{ fontSize: 10 }} /> {error}
      </div>
    )}
  </div>
);

const TicketRow: React.FC<{ icon: React.ReactNode; label: string; value?: string; placeholder?: string; muted?: boolean }> = ({ icon, label, value, placeholder, muted }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
    <span style={{ flexShrink: 0 }}>{icon}</span>
    <span style={{ fontSize: 12, color: muted ? "#BCBCA0" : "#6B7280", flexShrink: 0, whiteSpace: "nowrap" }}>{label}:</span>
    <span style={{ fontSize: 13, fontWeight: value ? 600 : 400, color: value ? (muted ? "#ABABAB" : "#1E293B") : "#C4C4A0", fontStyle: value ? "normal" : "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
      {value || placeholder || "—"}
    </span>
  </div>
);

export default CreatePurchaseOrderModal;
export type { CreatePurchaseOrderReq };