import React, { useState } from "react";
import { Modal, Input, InputNumber, Button, DatePicker } from "antd";
import {
  PlusOutlined, DeleteOutlined, ShoppingOutlined,
  CheckOutlined, InfoCircleOutlined, WarningOutlined,
  BgColorsOutlined, CalendarOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { ICreateDiaryItemReq } from "@/Interface/Diary/DiaryItem";
import { useCreateDiaryItem } from "../Hooks/useCreateDiaryItem";
import { QueryKeys } from "@/Constant/query-key";

/* ── local form type: unitPrice/quantity nullable để InputNumber có thể trống ── */
type ItemForm = Omit<ICreateDiaryItemReq, "quantity" | "unitPrice"> & {
  quantity: number | null;
  unitPrice: number | null;
};

type ItemErrors = Partial<Record<keyof ItemForm, string>>;

const EMPTY_ITEM = (): ItemForm => ({
  productName: "",
  quantity: null,
  unitPrice: null,
  itemDate: "",
  itemNote: "",
  color: "",
  volume: "",
});

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

/* ── Props ── */
interface CreateDiaryItemModalProps {
  open: boolean;
  diaryId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateDiaryItemModal: React.FC<CreateDiaryItemModalProps> = ({
  open,
  diaryId,
  onClose,
  onSuccess,
}) => {
  const [items, setItems] = useState<ItemForm[]>([EMPTY_ITEM()]);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<Record<number, ItemErrors>>({});

  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreateDiaryItem(diaryId, {
    onSuccess: (res) => {
      toast.success(
        `✅ Thêm ${items.length} sản phẩm thành công!`,
        { position: "top-right", autoClose: 3000 }
      );
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_DIARY_DETAIL, diaryId],
      });
      handleClose();
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? "Thêm sản phẩm thất bại, vui lòng thử lại.";
      toast.error(`❌ ${msg}`, { position: "top-right", autoClose: 4000 });
    },
  });

  const updateItem = (idx: number, field: keyof ItemForm, value: unknown) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
    if (errors[idx]?.[field])
      setErrors((prev) => ({ ...prev, [idx]: { ...prev[idx], [field]: undefined } }));
  };

  const addPanel = () => {
    const idx = items.length;
    setItems((prev) => [...prev, EMPTY_ITEM()]);
    setActive(idx);
  };

  const removePanel = (idx: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => { const n = { ...prev }; delete n[idx]; return n; });
    setActive((prev) => (prev >= idx ? Math.max(0, prev - 1) : prev));
  };

  const validate = (): boolean => {
    const errs: Record<number, ItemErrors> = {};
    items.forEach((it, i) => {
      const e: ItemErrors = {};
      if (!it.productName.trim()) e.productName = "Không được để trống";
      if (!it.quantity || it.quantity < 1) e.quantity = "Phải lớn hơn 0";
      if (!it.unitPrice || it.unitPrice <= 0) e.unitPrice = "Phải lớn hơn 0";
      if (Object.keys(e).length) errs[i] = e;
    });
    setErrors(errs);
    const firstErr = Object.keys(errs)[0];
    if (firstErr !== undefined) setActive(Number(firstErr));
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    const body: ICreateDiaryItemReq[] = items.map((it) => ({
      productName: it.productName,
      quantity: it.quantity!,
      unitPrice: it.unitPrice!,
      itemDate: it.itemDate || dayjs().format("YYYY-MM-DD"),
      itemNote: it.itemNote,
      color: it.color,
      volume: it.volume,
    }));
    mutate(body);
  };

  const handleClose = () => {
    setItems([EMPTY_ITEM()]);
    setErrors({});
    setActive(0);
    onClose();
  };

  const item = items[active] ?? EMPTY_ITEM();
  const errs = errors[active] ?? {};
  const errorCount = Object.keys(errors).length;
  const totalQty = items.reduce((s, it) => s + (it.quantity ?? 0), 0);
  const totalAmt = items.reduce((s, it) => s + (it.quantity ?? 0) * (it.unitPrice ?? 0), 0);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={960}
      centered
      styles={{
        content: { padding: 0, borderRadius: 18, overflow: "hidden" },
        header: { padding: "16px 24px", borderBottom: "1px solid #F1F5F9", marginBottom: 0 },
        body: { padding: 0, height: "72vh", display: "flex", flexDirection: "column", overflow: "hidden" },
        footer: { borderTop: "1px solid #F1F5F9", padding: "14px 24px", marginTop: 0 },
      }}
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <ShoppingOutlined className="text-[#C17B3F] text-lg" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-slate-900">Thêm sản phẩm vào nhật ký</div>
            <div className="text-xs text-slate-400 font-normal">
              Đã thêm {items.length} sản phẩm · Chọn sản phẩm bên trái để chỉnh sửa
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Tổng:{" "}
            <strong className="text-[#C17B3F]">{items.length} sản phẩm</strong>
            {" · "}
            <strong className="text-[#C17B3F]">{totalQty} đơn vị</strong>
            {totalAmt > 0 && (
              <>{" · "}<strong className="text-emerald-600">{fmtVND(totalAmt)}</strong></>
            )}
          </span>
          <div className="flex gap-2">
            <Button onClick={handleClose} disabled={isPending}>Huỷ</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleConfirm}
              loading={isPending}
              style={{ background: "#C17B3F", borderColor: "#C17B3F", fontWeight: 600 }}
            >
              Xác nhận thêm ({items.length})
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-1 overflow-hidden h-full">

        {/* ── LEFT: sidebar list ── */}
        <div className="w-[260px] shrink-0 border-r border-slate-100 flex flex-col bg-slate-50">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[.08em]">
              Danh sách ({items.length})
            </span>
            {errorCount > 0 && (
              <span className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                <WarningOutlined /> {errorCount} lỗi
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 pb-0">
            {items.map((it, idx) => {
              const hasErr = !!errors[idx];
              const isActive = active === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActive(idx)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] mb-1.5 cursor-pointer transition-all"
                  style={{
                    border: `1px solid ${hasErr ? "#FCA5A5" : isActive ? "#C17B3F" : "transparent"}`,
                    background: hasErr ? "#FFF5F5" : isActive ? "#FFF7ED" : "#fff",
                    boxShadow: isActive ? "0 0 0 3px rgba(193,123,63,.08)" : "none",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold"
                    style={{
                      background: hasErr ? "#EF4444" : isActive ? "#C17B3F" : "#E2E8F0",
                      color: hasErr || isActive ? "#fff" : "#64748B",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-semibold truncate"
                      style={{ color: it.productName ? "#1E293B" : "#94A3B8", fontStyle: it.productName ? "normal" : "italic" }}
                    >
                      {it.productName || "Chưa nhập tên"}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {it.quantity ? `SL: ${it.quantity}` : ""}
                      {it.quantity && it.unitPrice ? " · " : ""}
                      {it.unitPrice ? fmtVND(it.unitPrice) : ""}
                      {!it.quantity && !it.unitPrice && <i>Chưa nhập</i>}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removePanel(idx); }}
                      className="w-[22px] h-[22px] rounded-md border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0 p-0"
                    >
                      <DeleteOutlined style={{ fontSize: 12 }} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={addPanel}
            className="m-2.5 p-2.5 rounded-[10px] shrink-0 cursor-pointer flex items-center justify-center gap-1.5 text-[13px] font-medium transition-colors"
            style={{ border: "1.5px dashed #F0C49A", background: "transparent", color: "#C17B3F", fontFamily: "inherit" }}
          >
            <PlusOutlined /> Thêm sản phẩm
          </button>
        </div>

        {/* ── RIGHT: form ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-900">
              Sản phẩm {active + 1}
              {item.productName && (
                <span className="text-slate-400 font-normal ml-1.5">· {item.productName}</span>
              )}
            </span>
            {Object.keys(errs).length > 0 && (
              <span className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                <InfoCircleOutlined /> Có trường chưa hợp lệ
              </span>
            )}
          </div>

          <FormSection title="Thông tin sản phẩm" cols={2}>
            <div className="col-span-2">
              <FieldRow label="Tên sản phẩm" required error={errs.productName}>
                <Input
                  placeholder="Nhập tên sản phẩm..."
                  value={item.productName}
                  onChange={(e) => updateItem(active, "productName", e.target.value)}
                  status={errs.productName ? "error" : ""}
                  maxLength={150}
                  style={{ borderRadius: 8 }}
                />
              </FieldRow>
            </div>
            <FieldRow label="Màu sắc">
              <Input
                prefix={<BgColorsOutlined className="text-slate-400" />}
                placeholder="VD: Đỏ, Xanh..."
                value={item.color}
                onChange={(e) => updateItem(active, "color", e.target.value)}
                maxLength={50}
                style={{ borderRadius: 8 }}
              />
            </FieldRow>
            <FieldRow label="Quy cách">
              <Input
                placeholder="VD: 500ml, 1kg..."
                value={item.volume}
                onChange={(e) => updateItem(active, "volume", e.target.value)}
                maxLength={50}
                style={{ borderRadius: 8 }}
              />
            </FieldRow>
          </FormSection>

          <FormSection title="Số lượng & Giá" cols={3}>
            <FieldRow label="Số lượng" required error={errs.quantity}>
              <InputNumber
                min={1}
                placeholder="0"
                value={item.quantity}
                onChange={(v) => updateItem(active, "quantity", v)}
                status={errs.quantity ? "error" : ""}
                style={{ width: "100%", borderRadius: 8 }}
              />
            </FieldRow>
            <FieldRow label="Đơn giá (VNĐ)" required error={errs.unitPrice}>
              <InputNumber
                min={1}
                placeholder="0"
                value={item.unitPrice}
                onChange={(v) => updateItem(active, "unitPrice", v)}
                status={errs.unitPrice ? "error" : ""}
                formatter={(v) => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "")}
                parser={(v) => Number(v?.replace(/\./g, "") ?? 0)}
                style={{ width: "100%", borderRadius: 8 }}
              />
            </FieldRow>
            <FieldRow label="Thành tiền">
              <div className="h-8 px-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center text-[13px] font-bold text-emerald-600">
                {item.quantity && item.unitPrice ? fmtVND(item.quantity * item.unitPrice) : "—"}
              </div>
            </FieldRow>
          </FormSection>

          <FormSection title="Thông tin khác" cols={2}>
            <FieldRow label="Ngày nhập">
              <DatePicker
                placeholder="Chọn ngày..."
                format="DD/MM/YYYY"
                style={{ width: "100%", borderRadius: 8 }}
                value={item.itemDate ? dayjs(item.itemDate) : null}
                onChange={(d) => updateItem(active, "itemDate", d ? d.format("YYYY-MM-DD") : "")}
                suffixIcon={<CalendarOutlined className="text-slate-400" />}
              />
            </FieldRow>
            <div className="col-span-2">
              <FieldRow label="Ghi chú">
                <Input.TextArea
                  placeholder="Ghi chú thêm cho sản phẩm này..."
                  rows={2}
                  value={item.itemNote}
                  onChange={(e) => updateItem(active, "itemNote", e.target.value)}
                  maxLength={255}
                  style={{ borderRadius: 8, resize: "none" }}
                />
              </FieldRow>
            </div>
          </FormSection>
        </div>
      </div>
    </Modal>
  );
};

/* ── Helpers ── */
const FormSection: React.FC<{ title: string; cols?: number; children: React.ReactNode }> = ({
  title, cols = 2, children,
}) => (
  <div>
    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-[.1em] mb-2.5 pb-2 border-b border-slate-100">
      {title}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
      {children}
    </div>
  </div>
);

const FieldRow: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, error, children }) => (
  <div>
    <div className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-0.5">
      {label}
      {required && <span className="text-red-500">*</span>}
    </div>
    {children}
    {error && (
      <div className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
        <InfoCircleOutlined style={{ fontSize: 10 }} /> {error}
      </div>
    )}
  </div>
);

export default CreateDiaryItemModal;