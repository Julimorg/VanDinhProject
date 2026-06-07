import React, { useState, useEffect } from "react";
import { Modal, Input, InputNumber, Button, DatePicker, Tabs } from "antd";
import {
  PlusOutlined, DeleteOutlined, ShoppingOutlined,
  CheckOutlined, InfoCircleOutlined, WarningOutlined,
  BgColorsOutlined, CalendarOutlined, HistoryOutlined,
  AppstoreOutlined, CalendarOutlined as CalendarIcon,
  FolderOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { ICreateDiaryItemReq } from "@/Interface/Diary/DiaryItem";
import { useCreateDiaryItem } from "../Hooks/useCreateDiaryItem";
import { QueryKeys } from "@/Constant/query-key";

// ── Types ──────────────────────────────────────────────────────────────────
type ItemForm = Omit<ICreateDiaryItemReq, "quantity" | "unitPrice"> & {
  quantity: number | null;
  unitPrice: number | null;
};
type ItemErrors = Partial<Record<keyof ItemForm, string>>;

// Tab 2: group theo ngày
interface DateGroup {
  id: string;
  date: string; // YYYY-MM-DD
  items: ItemForm[];
  activeItem: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const EMPTY_ITEM = (): ItemForm => ({
  productName: "",
  quantity: null,
  unitPrice: null,
  itemDate: "",
  itemNote: "",
  color: "",
  volume: "",
});

const EMPTY_GROUP = (): DateGroup => ({
  id: crypto.randomUUID(),
  date: dayjs().format("YYYY-MM-DD"),
  items: [EMPTY_ITEM()],
  activeItem: 0,
});

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const storageKey = (diaryId: string) => `draft_diary_items_${diaryId}`;
const storageKeyGrouped = (diaryId: string) => `draft_diary_items_grouped_${diaryId}`;

const saveDraft = (diaryId: string, items: ItemForm[], active: number) =>
  sessionStorage.setItem(storageKey(diaryId), JSON.stringify({ items, active }));
const loadDraft = (diaryId: string): { items: ItemForm[]; active: number } | null => {
  try { const r = sessionStorage.getItem(storageKey(diaryId)); return r ? JSON.parse(r) : null; }
  catch { return null; }
};
const clearDraft = (diaryId: string) => sessionStorage.removeItem(storageKey(diaryId));

const saveGroupedDraft = (diaryId: string, groups: DateGroup[], activeGroup: number) =>
  sessionStorage.setItem(storageKeyGrouped(diaryId), JSON.stringify({ groups, activeGroup }));
const loadGroupedDraft = (diaryId: string): { groups: DateGroup[]; activeGroup: number } | null => {
  try { const r = sessionStorage.getItem(storageKeyGrouped(diaryId)); return r ? JSON.parse(r) : null; }
  catch { return null; }
};
const clearGroupedDraft = (diaryId: string) => sessionStorage.removeItem(storageKeyGrouped(diaryId));

// ── Props ──────────────────────────────────────────────────────────────────
interface CreateDiaryItemModalProps {
  open: boolean;
  diaryId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

// ══════════════════════════════════════════════════════════════════════════
const CreateDiaryItemModal: React.FC<CreateDiaryItemModalProps> = ({
  open, diaryId, onClose, onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"list" | "grouped">("list");

  // ── Tab 1 state ──
  const [items, setItems] = useState<ItemForm[]>([EMPTY_ITEM()]);
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<Record<number, ItemErrors>>({});
  const [hasDraft, setHasDraft] = useState(false);

  // ── Tab 2 state ──
  const [groups, setGroups] = useState<DateGroup[]>([EMPTY_GROUP()]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [groupErrors, setGroupErrors] = useState<Record<string, Record<number, ItemErrors>>>({});
  const [hasGroupedDraft, setHasGroupedDraft] = useState(false);

  const queryClient = useQueryClient();

  // ── Load drafts on open ──
  useEffect(() => {
    if (!open) return;
    const d = loadDraft(diaryId);
    if (d?.items?.length) { setHasDraft(true); setItems(d.items); setActive(d.active ?? 0); }
    const gd = loadGroupedDraft(diaryId);
    if (gd?.groups?.length) { setHasGroupedDraft(true); setGroups(gd.groups); setActiveGroup(gd.activeGroup ?? 0); }
  }, [open, diaryId]);

  // ── Auto-save ──
  useEffect(() => { if (open) saveDraft(diaryId, items, active); }, [items, active, open, diaryId]);
  useEffect(() => { if (open) saveGroupedDraft(diaryId, groups, activeGroup); }, [groups, activeGroup, open, diaryId]);

  const { mutate, isPending } = useCreateDiaryItem(diaryId, {
    onSuccess: () => {
      toast.success(`✅ Thêm sản phẩm thành công!`, { position: "top-right", autoClose: 3000 });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_DIARY_DETAIL, diaryId] });
      clearDraft(diaryId);
      clearGroupedDraft(diaryId);
      handleClose(true);
      onSuccess?.();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? "Thêm sản phẩm thất bại.";
      toast.error(`❌ ${msg}`, { position: "top-right", autoClose: 4000 });
    },
  });

  // ── Tab 1 handlers ──────────────────────────────────────────────────────
  const updateItem = (idx: number, field: keyof ItemForm, value: unknown) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
    if (errors[idx]?.[field])
      setErrors(prev => ({ ...prev, [idx]: { ...prev[idx], [field]: undefined } }));
  };
  const addPanel = () => { const idx = items.length; setItems(p => [...p, EMPTY_ITEM()]); setActive(idx); };
  const removePanel = (idx: number) => {
    if (items.length === 1) return;
    setItems(p => p.filter((_, i) => i !== idx));
    setErrors(p => { const n = { ...p }; delete n[idx]; return n; });
    setActive(p => p >= idx ? Math.max(0, p - 1) : p);
  };
  const validateTab1 = (): boolean => {
    const errs: Record<number, ItemErrors> = {};
    items.forEach((it, i) => {
      const e: ItemErrors = {};
      if (!it.productName.trim()) e.productName = "Không được để trống";
      if (!it.quantity || it.quantity < 1) e.quantity = "Phải lớn hơn 0";
      if (!it.unitPrice || it.unitPrice <= 0) e.unitPrice = "Phải lớn hơn 0";
      if (Object.keys(e).length) errs[i] = e;
    });
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first !== undefined) setActive(Number(first));
    return Object.keys(errs).length === 0;
  };

  // ── Tab 2 handlers ──────────────────────────────────────────────────────
  const updateGroupItem = (gIdx: number, iIdx: number, field: keyof ItemForm, value: unknown) => {
    setGroups(prev => prev.map((g, gi) =>
      gi !== gIdx ? g : {
        ...g,
        items: g.items.map((it, ii) => ii !== iIdx ? it : { ...it, [field]: value }),
      }
    ));
    const gid = groups[gIdx]?.id;
    if (gid && groupErrors[gid]?.[iIdx]?.[field])
      setGroupErrors(prev => ({
        ...prev,
        [gid]: { ...prev[gid], [iIdx]: { ...prev[gid][iIdx], [field]: undefined } },
      }));
  };

  const addGroupItem = (gIdx: number) => {
    setGroups(prev => prev.map((g, gi) =>
      gi !== gIdx ? g : { ...g, items: [...g.items, EMPTY_ITEM()], activeItem: g.items.length }
    ));
  };

  const removeGroupItem = (gIdx: number, iIdx: number) => {
    setGroups(prev => prev.map((g, gi) => {
      if (gi !== gIdx || g.items.length === 1) return g;
      const items = g.items.filter((_, ii) => ii !== iIdx);
      return { ...g, items, activeItem: Math.max(0, g.activeItem >= iIdx ? g.activeItem - 1 : g.activeItem) };
    }));
  };

  const setGroupActiveItem = (gIdx: number, iIdx: number) => {
    setGroups(prev => prev.map((g, gi) => gi !== gIdx ? g : { ...g, activeItem: iIdx }));
  };

  const addGroup = () => {
    const idx = groups.length;
    setGroups(p => [...p, EMPTY_GROUP()]);
    setActiveGroup(idx);
  };

  const removeGroup = (gIdx: number) => {
    if (groups.length === 1) return;
    setGroups(p => p.filter((_, i) => i !== gIdx));
    setActiveGroup(p => Math.max(0, p >= gIdx ? p - 1 : p));
  };

  const updateGroupDate = (gIdx: number, date: string) => {
    setGroups(prev => prev.map((g, gi) => gi !== gIdx ? g : { ...g, date }));
  };

  const validateTab2 = (): boolean => {
    const errs: Record<string, Record<number, ItemErrors>> = {};
    groups.forEach(g => {
      const gErrs: Record<number, ItemErrors> = {};
      g.items.forEach((it, i) => {
        const e: ItemErrors = {};
        if (!it.productName.trim()) e.productName = "Không được để trống";
        if (!it.quantity || it.quantity < 1) e.quantity = "Phải lớn hơn 0";
        if (!it.unitPrice || it.unitPrice <= 0) e.unitPrice = "Phải lớn hơn 0";
        if (Object.keys(e).length) gErrs[i] = e;
      });
      if (Object.keys(gErrs).length) errs[g.id] = gErrs;
    });
    setGroupErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstGid = Object.keys(errs)[0];
      const gIdx = groups.findIndex(g => g.id === firstGid);
      if (gIdx >= 0) {
        setActiveGroup(gIdx);
        const firstItem = Number(Object.keys(errs[firstGid])[0]);
        setGroupActiveItem(gIdx, firstItem);
      }
    }
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleConfirm = () => {
    if (activeTab === "list") {
      if (!validateTab1()) return;
      const body: ICreateDiaryItemReq[] = items.map(it => ({
        productName: it.productName,
        quantity: it.quantity!,
        unitPrice: it.unitPrice!,
        itemDate: it.itemDate || dayjs().format("YYYY-MM-DD"),
        itemNote: it.itemNote,
        color: it.color,
        volume: it.volume,
      }));
      mutate(body);
    } else {
      if (!validateTab2()) return;
      const body: ICreateDiaryItemReq[] = groups.flatMap(g =>
        g.items.map(it => ({
          productName: it.productName,
          quantity: it.quantity!,
          unitPrice: it.unitPrice!,
          itemDate: g.date || dayjs().format("YYYY-MM-DD"),
          itemNote: it.itemNote,
          color: it.color,
          volume: it.volume,
        }))
      );
      mutate(body);
    }
  };

  const handleClose = (clearOnSuccess = false) => {
    if (clearOnSuccess) { clearDraft(diaryId); clearGroupedDraft(diaryId); }
    setItems([EMPTY_ITEM()]); setErrors({}); setActive(0); setHasDraft(false);
    setGroups([EMPTY_GROUP()]); setGroupErrors({}); setActiveGroup(0); setHasGroupedDraft(false);
    onClose();
  };

  const handleDiscardDraft = () => {
    if (activeTab === "list") {
      clearDraft(diaryId); setItems([EMPTY_ITEM()]); setErrors({}); setActive(0); setHasDraft(false);
    } else {
      clearGroupedDraft(diaryId); setGroups([EMPTY_GROUP()]); setGroupErrors({}); setActiveGroup(0); setHasGroupedDraft(false);
    }
    toast.info("Đã xóa bản nháp.", { position: "top-right", autoClose: 2000 });
  };

  // ── Computed ────────────────────────────────────────────────────────────
  const tab1Total = items.reduce((s, it) => s + (it.quantity ?? 0) * (it.unitPrice ?? 0), 0);
  const tab1Qty = items.reduce((s, it) => s + (it.quantity ?? 0), 0);
  const tab2AllItems = groups.flatMap(g => g.items);
  const tab2Total = tab2AllItems.reduce((s, it) => s + (it.quantity ?? 0) * (it.unitPrice ?? 0), 0);
  const tab2Qty = tab2AllItems.reduce((s, it) => s + (it.quantity ?? 0), 0);
  const tab2Count = tab2AllItems.length;

  const errorCount = Object.keys(errors).length;
  const groupedErrorCount = Object.keys(groupErrors).length;

  const item = items[active] ?? EMPTY_ITEM();
  const errs = errors[active] ?? {};

  const currentGroup = groups[activeGroup] ?? groups[0];
  const currentGroupItem = currentGroup?.items[currentGroup.activeItem] ?? EMPTY_ITEM();
  const currentGroupErrs = groupErrors[currentGroup?.id]?.[currentGroup?.activeItem] ?? {};

  const totalCount = activeTab === "list" ? items.length : tab2Count;
  const totalQty = activeTab === "list" ? tab1Qty : tab2Qty;
  const totalAmt = activeTab === "list" ? tab1Total : tab2Total;
  const currentHasDraft = activeTab === "list" ? hasDraft : hasGroupedDraft;

  return (
    <Modal
      open={open}
      onCancel={() => handleClose()}
      width={960}
      centered
      styles={{
        content: { padding: 0, borderRadius: 18, overflow: "hidden" },
        header: { padding: "16px 24px", borderBottom: "1px solid #F1F5F9", marginBottom: 0 },
        body: { padding: 0, height: "76vh", display: "flex", flexDirection: "column", overflow: "hidden" },
        footer: { borderTop: "1px solid #F1F5F9", padding: "14px 24px", marginTop: 0 },
      }}
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <ShoppingOutlined className="text-[#C17B3F] text-lg" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-slate-900">Thêm sản phẩm vào nhật ký</div>
            <div className="text-xs text-slate-400 font-normal flex items-center gap-2">
              {activeTab === "list"
                ? `Đã thêm ${items.length} sản phẩm · Chọn sản phẩm bên trái để chỉnh sửa`
                : `${groups.length} nhóm ngày · ${tab2Count} sản phẩm`
              }
              {currentHasDraft && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                  <HistoryOutlined style={{ fontSize: 10 }} /> Đã khôi phục bản nháp
                </span>
              )}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Tổng: <strong className="text-[#C17B3F]">{totalCount} sản phẩm</strong>
              {" · "}<strong className="text-[#C17B3F]">{totalQty} đơn vị</strong>
              {totalAmt > 0 && <>{" · "}<strong className="text-emerald-600">{fmtVND(totalAmt)}</strong></>}
            </span>
            {currentHasDraft && (
              <button
                onClick={handleDiscardDraft}
                className="text-[11px] text-slate-400 hover:text-red-500 underline underline-offset-2 cursor-pointer bg-transparent border-none p-0 transition-colors"
              >
                Xóa bản nháp
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleClose()} disabled={isPending}>Huỷ</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleConfirm}
              loading={isPending}
              style={{ background: "#C17B3F", borderColor: "#C17B3F", fontWeight: 600 }}
            >
              Xác nhận thêm ({totalCount})
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* ── Tab switcher ── */}
        <div className="px-4 pt-3 pb-0 border-b border-slate-100 shrink-0">
          <Tabs
            activeKey={activeTab}
            onChange={(k) => setActiveTab(k as "list" | "grouped")}
            size="small"
            style={{ marginBottom: 0 }}
            items={[
              {
                key: "list",
                label: (
                  <span className="flex items-center gap-1.5 text-[13px]">
                    <AppstoreOutlined />
                    Danh sách
                    {errorCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                        {errorCount}
                      </span>
                    )}
                  </span>
                ),
              },
              {
                key: "grouped",
                label: (
                  <span className="flex items-center gap-1.5 text-[13px]">
                    <CalendarIcon />
                    Theo ngày
                    {groupedErrorCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                        {groupedErrorCount}
                      </span>
                    )}
                  </span>
                ),
              },
            ]}
          />
        </div>

        {/* ── Tab 1: List (giữ nguyên logic cũ) ── */}
        {activeTab === "list" && (
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT sidebar */}
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
                      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold"
                        style={{
                          background: hasErr ? "#EF4444" : isActive ? "#C17B3F" : "#E2E8F0",
                          color: hasErr || isActive ? "#fff" : "#64748B",
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate"
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

            {/* RIGHT form */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-900">
                  Sản phẩm {active + 1}
                  {item.productName && <span className="text-slate-400 font-normal ml-1.5">· {item.productName}</span>}
                </span>
                {Object.keys(errs).length > 0 && (
                  <span className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                    <InfoCircleOutlined /> Có trường chưa hợp lệ
                  </span>
                )}
              </div>
              <ItemFormFields item={item} errs={errs} onChange={(f, v) => updateItem(active, f, v)} />
            </div>
          </div>
        )}

        {/* ── Tab 2: Grouped by date ── */}
        {activeTab === "grouped" && (
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT: group list */}
            <div className="w-[220px] shrink-0 border-r border-slate-100 flex flex-col bg-slate-50">
              <div className="px-4 py-3 border-b border-slate-100 shrink-0">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[.08em]">
                  {groups.length} nhóm ngày
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 pb-0">
                {groups.map((g, gIdx) => {
                  const isActive = activeGroup === gIdx;
                  const hasErr = !!groupErrors[g.id];
                  const itemCount = g.items.length;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setActiveGroup(gIdx)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] mb-1.5 cursor-pointer transition-all"
                      style={{
                        border: `1px solid ${hasErr ? "#FCA5A5" : isActive ? "#C17B3F" : "transparent"}`,
                        background: hasErr ? "#FFF5F5" : isActive ? "#FFF7ED" : "#fff",
                        boxShadow: isActive ? "0 0 0 3px rgba(193,123,63,.08)" : "none",
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                        style={{ background: hasErr ? "#FEE2E2" : isActive ? "#FEF3C7" : "#F1F5F9" }}
                      >
                        <CalendarOutlined style={{ fontSize: 13, color: hasErr ? "#EF4444" : isActive ? "#C17B3F" : "#94A3B8" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-700 truncate">
                          {g.date ? dayjs(g.date).format("DD/MM/YYYY") : "Chọn ngày..."}
                        </div>
                        <div className="text-[10px] text-slate-400">{itemCount} sản phẩm</div>
                      </div>
                      {groups.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeGroup(gIdx); }}
                          className="w-[20px] h-[20px] border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors shrink-0 p-0"
                        >
                          <DeleteOutlined style={{ fontSize: 11 }} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={addGroup}
                className="m-2 p-2 rounded-[10px] shrink-0 cursor-pointer flex items-center justify-center gap-1.5 text-[12px] font-medium"
                style={{ border: "1.5px dashed #F0C49A", background: "transparent", color: "#C17B3F", fontFamily: "inherit" }}
              >
                <PlusOutlined /> Thêm nhóm ngày
              </button>
            </div>

            {/* MIDDLE: item list of selected group */}
            <div className="w-[200px] shrink-0 border-r border-slate-100 flex flex-col bg-white">
              {/* Date picker for this group */}
              <div className="px-3 py-3 border-b border-slate-100 shrink-0">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Ngày nhập hàng
                </div>
                <DatePicker
                  value={currentGroup?.date ? dayjs(currentGroup.date) : null}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày..."
                  style={{ width: "100%", borderRadius: 8 }}
                  onChange={(d) => updateGroupDate(activeGroup, d ? d.format("YYYY-MM-DD") : "")}
                  suffixIcon={<CalendarOutlined className="text-slate-400" />}
                />
              </div>

              {/* Item list */}
              <div className="px-2 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                  Sản phẩm ({currentGroup?.items.length ?? 0})
                </span>
                {groupErrors[currentGroup?.id] && (
                  <span className="text-[10px] text-red-500 flex items-center gap-0.5">
                    <WarningOutlined style={{ fontSize: 10 }} />
                    {Object.keys(groupErrors[currentGroup.id]).length} lỗi
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-2 pb-0">
                {currentGroup?.items.map((it, iIdx) => {
                  const isActive = currentGroup.activeItem === iIdx;
                  const hasErr = !!groupErrors[currentGroup.id]?.[iIdx];
                  return (
                    <div
                      key={iIdx}
                      onClick={() => setGroupActiveItem(activeGroup, iIdx)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] mb-1 cursor-pointer transition-all"
                      style={{
                        border: `1px solid ${hasErr ? "#FCA5A5" : isActive ? "#C17B3F" : "transparent"}`,
                        background: hasErr ? "#FFF5F5" : isActive ? "#FFF7ED" : "transparent",
                      }}
                    >
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: hasErr ? "#EF4444" : isActive ? "#C17B3F" : "#E2E8F0",
                          color: hasErr || isActive ? "#fff" : "#64748B",
                        }}
                      >
                        {iIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold truncate"
                          style={{ color: it.productName ? "#1E293B" : "#94A3B8", fontStyle: it.productName ? "normal" : "italic" }}
                        >
                          {it.productName || "Chưa nhập"}
                        </div>
                        {it.quantity && (
                          <div className="text-[10px] text-slate-400">SL: {it.quantity}</div>
                        )}
                      </div>
                      {(currentGroup?.items.length ?? 0) > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeGroupItem(activeGroup, iIdx); }}
                          className="w-[18px] h-[18px] border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors p-0"
                        >
                          <DeleteOutlined style={{ fontSize: 10 }} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => addGroupItem(activeGroup)}
                className="m-2 p-2 rounded-[8px] shrink-0 cursor-pointer flex items-center justify-center gap-1 text-[11px] font-medium"
                style={{ border: "1.5px dashed #F0C49A", background: "transparent", color: "#C17B3F", fontFamily: "inherit" }}
              >
                <PlusOutlined /> Thêm sản phẩm
              </button>
            </div>

            {/* RIGHT: form for selected item */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-bold text-slate-900">
                    Sản phẩm {(currentGroup?.activeItem ?? 0) + 1}
                    {currentGroupItem.productName && (
                      <span className="text-slate-400 font-normal ml-1.5">· {currentGroupItem.productName}</span>
                    )}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <CalendarOutlined style={{ fontSize: 10 }} />
                    Ngày: {currentGroup?.date ? dayjs(currentGroup.date).format("DD/MM/YYYY") : "Chưa chọn ngày"}
                  </div>
                </div>
                {Object.keys(currentGroupErrs).length > 0 && (
                  <span className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                    <InfoCircleOutlined /> Có trường chưa hợp lệ
                  </span>
                )}
              </div>
              <ItemFormFields
                item={currentGroupItem}
                errs={currentGroupErrs}
                onChange={(f, v) => updateGroupItem(activeGroup, currentGroup?.activeItem ?? 0, f, v)}
                hideDate // ngày đã được set ở group level
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// ── Shared form fields component ────────────────────────────────────────────
const ItemFormFields: React.FC<{
  item: ItemForm;
  errs: ItemErrors;
  onChange: (field: keyof ItemForm, value: unknown) => void;
  hideDate?: boolean;
}> = ({ item, errs, onChange, hideDate = false }) => (
  <>
    <FormSection title="Thông tin sản phẩm" cols={2}>
      <div className="col-span-2">
        <FieldRow label="Tên sản phẩm" required error={errs.productName}>
          <Input
            placeholder="Nhập tên sản phẩm..."
            value={item.productName}
            onChange={(e) => onChange("productName", e.target.value)}
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
          onChange={(e) => onChange("color", e.target.value)}
          maxLength={50}
          style={{ borderRadius: 8 }}
        />
      </FieldRow>
      <FieldRow label="Quy cách">
        <Input
          placeholder="VD: 500ml, 1kg..."
          value={item.volume}
          onChange={(e) => onChange("volume", e.target.value)}
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
          onChange={(v) => onChange("quantity", v)}
          status={errs.quantity ? "error" : ""}
          style={{ width: "100%", borderRadius: 8 }}
        />
      </FieldRow>
      <FieldRow label="Đơn giá (VNĐ)" required error={errs.unitPrice}>
        <InputNumber
          min={1}
          placeholder="0"
          value={item.unitPrice}
          onChange={(v) => onChange("unitPrice", v)}
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
      {!hideDate && (
        <FieldRow label="Ngày nhập">
          <DatePicker
            placeholder="Chọn ngày..."
            format="DD/MM/YYYY"
            style={{ width: "100%", borderRadius: 8 }}
            value={item.itemDate ? dayjs(item.itemDate) : null}
            onChange={(d) => onChange("itemDate", d ? d.format("YYYY-MM-DD") : "")}
            suffixIcon={<CalendarOutlined className="text-slate-400" />}
          />
        </FieldRow>
      )}
      <div className={hideDate ? "col-span-2" : "col-span-2"}>
        <FieldRow label="Ghi chú">
          <Input.TextArea
            placeholder="Ghi chú thêm cho sản phẩm này..."
            rows={2}
            value={item.itemNote}
            onChange={(e) => onChange("itemNote", e.target.value)}
            maxLength={255}
            style={{ borderRadius: 8, resize: "none" }}
          />
        </FieldRow>
      </div>
    </FormSection>
  </>
);

// ── Helpers ─────────────────────────────────────────────────────────────────
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
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}> = ({ label, required, error, children }) => (
  <div>
    <div className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-0.5">
      {label}{required && <span className="text-red-500">*</span>}
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