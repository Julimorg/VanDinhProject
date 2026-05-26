import React from "react";
import { Pagination, ConfigProvider, message, Select } from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { usePurchaseOrders } from "./Hooks/UsePurchaseOrder";
import { GetPurchaseOrderRes, PurchaseOrderStatus } from "./purchaseOrder";
import PurchaseOrderGrid from "./Components/PurchaseOrderGrid";
import FilterBar from "./Components/FilterBar";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const PurchaseOrderPage: React.FC = () => {
  const { params, orders, total, updateFilter, changePage, resetFilter } =
    usePurchaseOrders();

  const handleView = (order: GetPurchaseOrderRes) => {
    message.info(`Xem chi tiết: ${order.poCode}`);
  };

  const handleEdit = (order: GetPurchaseOrderRes) => {
    message.success(`Chỉnh sửa: ${order.poCode}`);
  };

  const totalPages = Math.ceil(total / params.pageSize) || 1;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4F46E5",
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, sans-serif",
        },
      }}
    >
      <div className="min-h-screen" style={{ background: "#F4F5F7" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">

          {/* Page header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#4F46E5",
                  boxShadow: "0 4px 14px rgba(79,70,229,.35)",
                }}
              >
                <InboxOutlined style={{ color: "#fff", fontSize: 20 }} />
              </div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", lineHeight: 1.25, margin: 0 }}>
                  Phiếu nhập kho
                </h1>
                <p style={{ fontSize: 12, color: "#94A3B8", margin: 0, marginTop: 2 }}>
                  Quản lý Purchase Order
                </p>
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="middle"
              style={{ background: "#4F46E5", borderColor: "#4F46E5", fontWeight: 600 }}
              onClick={() => message.success("Tạo phiếu nhập kho mới")}
            >
              Tạo phiếu mới
            </Button>
          </div>

          {/* Filter bar */}
          <FilterBar
            params={params}
            onSearch={(val) => updateFilter({ search: val })}
            onStatusChange={(val) => updateFilter({ status: val as PurchaseOrderStatus | "" })}
            onDateRangeChange={(from, to) =>
              updateFilter({ orderDateFrom: from, orderDateTo: to })
            }
            onReset={resetFilter}
            total={total}
          />

          {/* Card grid */}
          <PurchaseOrderGrid
            orders={orders}
            loading={false}
            onView={handleView}
            onEdit={handleEdit}
          />

          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center justify-end gap-3 flex-wrap">
              {/* Page size selector */}
              <Select
                value={params.pageSize}
                onChange={(val) => updateFilter({ pageSize: val, page: 1 })}
                style={{ width: 120 }}
                options={PAGE_SIZE_OPTIONS.map((n) => ({
                  value: n,
                  label: `${n} / trang`,
                }))}
                popupMatchSelectWidth={false}
              />

              {/* Prev */}
              <button
                disabled={params.page <= 1}
                onClick={() => changePage(params.page - 1)}
                style={{
                  width: 32, height: 32, borderRadius: 6,
                  border: "1px solid #E2E8F0", background: "#fff",
                  cursor: params.page <= 1 ? "not-allowed" : "pointer",
                  opacity: params.page <= 1 ? 0.4 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "#374151",
                }}
              >
                ‹
              </button>

              {/* Page number */}
              <div
                style={{
                  height: 32, minWidth: 40, padding: "0 10px",
                  borderRadius: 6, border: "1.5px solid #4F46E5",
                  background: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 13, fontWeight: 600,
                  color: "#4F46E5",
                }}
              >
                {params.page}
              </div>

              {/* Next */}
              <button
                disabled={params.page >= totalPages}
                onClick={() => changePage(params.page + 1)}
                style={{
                  width: 32, height: 32, borderRadius: 6,
                  border: "1px solid #E2E8F0", background: "#fff",
                  cursor: params.page >= totalPages ? "not-allowed" : "pointer",
                  opacity: params.page >= totalPages ? 0.4 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "#374151",
                }}
              >
                ›
              </button>

              <span style={{ fontSize: 12, color: "#94A3B8" }}>
                {(params.page - 1) * params.pageSize + 1}–
                {Math.min(params.page * params.pageSize, total)} / {total} phiếu
              </span>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PurchaseOrderPage;