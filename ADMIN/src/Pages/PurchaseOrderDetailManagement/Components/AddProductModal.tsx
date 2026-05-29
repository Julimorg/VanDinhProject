import React, { useState } from "react";
import { Modal, Input, InputNumber, DatePicker, Button } from "antd";
import {
  PlusOutlined, DeleteOutlined, ShoppingCartOutlined,
  CheckOutlined, InfoCircleOutlined, WarningOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { ICreatePurchaseOrderItemRequest } from "@/Interface/Inventory/CreatePurchaseOrderItem";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/Constant/query-key";
import { useCreatePurchaseOrderItems } from "../Hooks/useCreatePurchaseOrderItems";

interface AddPurchaseItemForm {
  productName: string;
  productCode: string;
  productVolume: string;
  colorName: string;
  supplierName: string;
  quantityOrdered: number | null;
  costPrice: number | null;
  expiryDate: string | null;
  note: string;
}

const EMPTY_ITEM = (): AddPurchaseItemForm => ({
  productName: "", productCode: "", productVolume: "",
  colorName: "", supplierName: "",
  quantityOrdered: null, costPrice: null,
  expiryDate: null, note: "",
});

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  purchaseOrderId: string;          
  onSuccess?: () => void;           
}

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const AddProductModal: React.FC<AddProductModalProps> = ({
  open, onClose, purchaseOrderId, onSuccess,
}) => {
  const [items, setItems] = useState<AddPurchaseItemForm[]>([EMPTY_ITEM()]);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<Record<number, Partial<Record<keyof AddPurchaseItemForm, string>>>>({});

  const queryClient = useQueryClient();

  const { mutate, isPending } = useCreatePurchaseOrderItems(purchaseOrderId, {
    onSuccess: (res) => {
      toast.success(
        `Thêm ${items.length} sản phẩm thành công! Mã phiếu: ${res.data.poCode}`,
        { position: "top-right", autoClose: 3000 }
      );
    
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_PURCHASE_DETAIL, purchaseOrderId],
      });
      handleClose();
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? "Thêm sản phẩm thất bại, vui lòng thử lại.";
      toast.error(`${msg}`, { position: "top-right", autoClose: 4000 });
    },
  });

  const updateItem = (idx: number, field: keyof AddPurchaseItemForm, value: unknown) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
    if (errors[idx]?.[field])
      setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], [field]: undefined } }));
  };

  const addPanel = () => {
    const idx = items.length;
    setItems(prev => [...prev, EMPTY_ITEM()]);
    setActive(idx);
  };

  const removePanel = (idx: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== idx));
    setErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
    setActive(prev => (prev >= idx ? Math.max(0, prev - 1) : prev));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    items.forEach((it, i) => {
      const e: Partial<Record<keyof AddPurchaseItemForm, string>> = {};
      if (!it.productName.trim()) e.productName = "Không được để trống";
      if (!it.quantityOrdered || it.quantityOrdered <= 0) e.quantityOrdered = "Phải lớn hơn 0";
      if (!it.costPrice || it.costPrice <= 0) e.costPrice = "Phải lớn hơn 0";
      if (Object.keys(e).length) errs[i] = e;
    });
    setErrors(errs);
    const firstErr = Object.keys(errs)[0];
    if (firstErr !== undefined) setActive(Number(firstErr));
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;

    // map form → request body
    const body: ICreatePurchaseOrderItemRequest[] = items.map((it) => ({
      productName:     it.productName,
      productCode:     it.productCode,
      productVolume:   it.productVolume,
      colorName:       it.colorName,
      supplierName:    it.supplierName,
      quantityOrdered: it.quantityOrdered!,
      costPrice:       it.costPrice!,
      expiryDate:      it.expiryDate
        ? dayjs(it.expiryDate).format("YYYY-MM-DDTHH:mm:ss")
        : "",
      note:            it.note,
    }));

    mutate(body);
  };

  const handleClose = () => {
    setItems([EMPTY_ITEM()]); setErrors({}); setActive(0); onClose();
  };

  const item = items[active] ?? EMPTY_ITEM();
  const errs = errors[active] ?? {};
  const totalAmount = items.reduce(
    (s, it) => s + (it.quantityOrdered ?? 0) * (it.costPrice ?? 0), 0
  );
  const errorCount = Object.keys(errors).length;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={1020}
      centered
      styles={{
        body: { padding: 0, height: "72vh", display: "flex", flexDirection: "column", overflow: "hidden" },
        header: { padding: "16px 24px", borderBottom: "1px solid #F1F5F9", marginBottom: 0 },
        footer: { borderTop: "1px solid #F1F5F9", padding: "14px 24px", marginTop: 0 },
        content: { padding: 0 },
      }}
      title={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "#EEF2FF", flexShrink: 0 }}>
            <ShoppingCartOutlined style={{ color: "#4F46E5", fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Thêm sản phẩm vào phiếu</div>
            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 400 }}>
              Đã thêm {items.length} sản phẩm · Chọn sản phẩm bên trái để chỉnh sửa
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <span style={{ fontSize: 12, color: "#94A3B8" }}>
            Tổng: <strong style={{ color: "#4F46E5" }}>{items.length} sản phẩm</strong>
            {" · "}
            <strong style={{ color: "#059669" }}>{fmtVND(totalAmount)}</strong>
          </span>
          <div className="flex gap-2">
            <Button onClick={handleClose} disabled={isPending}>Huỷ</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleConfirm}
              loading={isPending}
              style={{ background: "#4F46E5", borderColor: "#4F46E5", fontWeight: 600 }}
            >
              Xác nhận thêm ({items.length})
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>

        {/* LEFT */}
        <div style={{ width: 270, flexShrink: 0, borderRight: "1px solid #F1F5F9", display: "flex", flexDirection: "column", background: "#F8FAFC" }}>
          <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: ".08em" }}>
              Danh sách ({items.length})
            </span>
            {errorCount > 0 && (
              <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                <WarningOutlined /> {errorCount} lỗi
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px 0" }}>
            {items.map((it, idx) => {
              const hasErr = !!errors[idx];
              const isActive = active === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActive(idx)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10, marginBottom: 6, cursor: "pointer",
                    border: `1px solid ${hasErr ? "#FCA5A5" : isActive ? "#4F46E5" : "transparent"}`,
                    background: hasErr ? "#FFF5F5" : isActive ? "#EEF2FF" : "#fff",
                    boxShadow: isActive ? "0 0 0 3px rgba(79,70,229,.08)" : "none",
                    transition: "all .15s",
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: hasErr ? "#EF4444" : isActive ? "#4F46E5" : "#E2E8F0", color: (hasErr || isActive) ? "#fff" : "#64748B", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: it.productName ? "#1E293B" : "#94A3B8", fontStyle: it.productName ? "normal" : "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {it.productName || "Chưa nhập tên"}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                      {it.quantityOrdered ? `SL: ${it.quantityOrdered}` : ""}
                      {it.quantityOrdered && it.costPrice ? " · " : ""}
                      {it.costPrice ? fmtVND(it.costPrice) : ""}
                      {!it.quantityOrdered && !it.costPrice && <i>Chưa nhập</i>}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={e => { e.stopPropagation(); removePanel(idx); }}
                      style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#CBD5E1", padding: 0, flexShrink: 0 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FEE2E2"; (e.currentTarget as HTMLElement).style.color = "#EF4444"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#CBD5E1"; }}
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
            style={{ margin: 10, padding: "10px", borderRadius: 10, flexShrink: 0, border: "1.5px dashed #C7D2FE", background: "transparent", color: "#4F46E5", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <PlusOutlined /> Thêm sản phẩm
          </button>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
              Sản phẩm {active + 1}
              {item.productName && <span style={{ color: "#94A3B8", fontWeight: 400, marginLeft: 6 }}>· {item.productName}</span>}
            </span>
            {Object.keys(errs).length > 0 && (
              <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                <InfoCircleOutlined /> Có trường chưa hợp lệ
              </span>
            )}
          </div>

          <FormSection title="Thông tin sản phẩm">
            <div className="col-span-2">
              <FieldRow label="Tên sản phẩm" required error={errs.productName}>
                <Input placeholder="Nhập tên sản phẩm..." value={item.productName}
                  onChange={e => updateItem(active, "productName", e.target.value)}
                  status={errs.productName ? "error" : ""} style={{ borderRadius: 8 }} />
              </FieldRow>
            </div>
            <FieldRow label="Mã sản phẩm">
              <Input placeholder="VD: SNT-CAO-001" value={item.productCode}
                onChange={e => updateItem(active, "productCode", e.target.value)} style={{ borderRadius: 8 }} />
            </FieldRow>
            <FieldRow label="Quy cách / Thể tích">
              <Input placeholder="VD: 5L, 18L, 20kg" value={item.productVolume}
                onChange={e => updateItem(active, "productVolume", e.target.value)} style={{ borderRadius: 8 }} />
            </FieldRow>
            <FieldRow label="Màu sắc">
              <Input placeholder="VD: Trắng ngà, Xám xi măng" value={item.colorName}
                onChange={e => updateItem(active, "colorName", e.target.value)} style={{ borderRadius: 8 }} />
            </FieldRow>
            <FieldRow label="Nhà cung cấp">
              <Input placeholder="Tên nhà cung cấp" value={item.supplierName}
                onChange={e => updateItem(active, "supplierName", e.target.value)} style={{ borderRadius: 8 }} />
            </FieldRow>
          </FormSection>

          <FormSection title="Số lượng & Giá" cols={3}>
            <FieldRow label="Số lượng đặt" required error={errs.quantityOrdered}>
              <InputNumber min={1} placeholder="0" value={item.quantityOrdered}
                onChange={val => updateItem(active, "quantityOrdered", val)}
                status={errs.quantityOrdered ? "error" : ""} style={{ width: "100%", borderRadius: 8 }} />
            </FieldRow>
            <FieldRow label="Đơn giá (VNĐ)" required error={errs.costPrice}>
              <InputNumber min={0} placeholder="0" value={item.costPrice}
                onChange={val => updateItem(active, "costPrice", val)}
                status={errs.costPrice ? "error" : ""}
                formatter={val => val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                parser={val => Number(val?.replace(/,/g, "") ?? 0)}
                style={{ width: "100%", borderRadius: 8 }} addonAfter="₫" />
            </FieldRow>
            <FieldRow label="Thành tiền">
              <div style={{ height: 32, padding: "0 11px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, color: "#059669" }}>
                {item.quantityOrdered && item.costPrice ? fmtVND(item.quantityOrdered * item.costPrice) : "—"}
              </div>
            </FieldRow>
          </FormSection>

          <FormSection title="Thông tin khác">
            <FieldRow label="Hạn sử dụng">
              <DatePicker
                placeholder="Chọn ngày hết hạn"
                format="DD/MM/YYYY"
                style={{ width: "100%", borderRadius: 8 }}
                value={item.expiryDate ? dayjs(item.expiryDate) : null}
                onChange={(date) => updateItem(active, "expiryDate", date ? date.toISOString() : null)}
              />
            </FieldRow>
            <div className="col-span-2">
              <FieldRow label="Ghi chú">
                <Input.TextArea placeholder="Ghi chú thêm..." rows={2} value={item.note}
                  onChange={e => updateItem(active, "note", e.target.value)}
                  style={{ borderRadius: 8, resize: "none" }} />
              </FieldRow>
            </div>
          </FormSection>
        </div>
      </div>
    </Modal>
  );
};

/* ── helpers ── */
const FormSection: React.FC<{ title: string; cols?: number; children: React.ReactNode }> = ({ title, cols = 2, children }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #F1F5F9" }}>
      {title}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
      {children}
    </div>
  </div>
);

const FieldRow: React.FC<{ label: string; required?: boolean; error?: string; children: React.ReactNode }> = ({ label, required, error, children }) => (
  <div>
    <div style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 5, display: "flex", alignItems: "center", gap: 3 }}>
      {label}{required && <span style={{ color: "#EF4444" }}>*</span>}
    </div>
    {children}
    {error && (
      <div style={{ fontSize: 11, color: "#EF4444", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
        <InfoCircleOutlined style={{ fontSize: 10 }} />{error}
      </div>
    )}
  </div>
);

export default AddProductModal;
export type { AddPurchaseItemForm };