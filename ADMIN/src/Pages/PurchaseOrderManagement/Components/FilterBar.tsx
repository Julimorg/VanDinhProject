import React from "react";
import { Input, Select, DatePicker, Button, Space, Tooltip } from "antd";
import { SearchOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { FilterParams, PurchaseOrderStatus } from "@/Types/inventory/purchaseOrderTypes";
import { STATUS_CONFIG } from "@/Constant/inventory-contants";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Props {
  params: FilterParams;
  onSearch: (v: string) => void;
  onStatusChange: (v: PurchaseOrderStatus | undefined) => void; 
  onDateRangeChange: (from?: string, to?: string) => void;
  onReset: () => void;
  total: number;
}


const FilterBar: React.FC<Props> = ({ params, onSearch, onStatusChange, onDateRangeChange, onReset, total }) => {
  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
  if (!dates || (!dates[0] && !dates[1])) return onDateRangeChange(undefined, undefined);
  onDateRangeChange(
    dates[0]?.startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
dates[1]?.endOf("day").format("YYYY-MM-DDTHH:mm:ss")      
  );
};

  const rangeValue: [Dayjs, Dayjs] | undefined =
    params.orderDateFrom && params.orderDateTo
      ? [dayjs(params.orderDateFrom), dayjs(params.orderDateTo)]
      : undefined;

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Input
          allowClear
          prefix={<SearchOutlined style={{ color: "#9CA3AF" }} />}
          placeholder="Tìm theo mã PO, nhà cung cấp, người tạo..."
          style={{ flex: 1, borderRadius: 8 }}
          value={params.search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Tooltip title="Đặt lại bộ lọc">
          <Button icon={<ReloadOutlined />} onClick={onReset} />
        </Tooltip>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9CA3AF", fontSize: 12, flexShrink: 0 }}>
          <FilterOutlined />
          <span>Bộ lọc</span>
        </div>
        <RangePicker
          style={{ flex: 1, minWidth: 220 }}
          placeholder={["Từ ngày đặt hàng", "Đến ngày"]}
          format="DD/MM/YYYY"
          value={rangeValue as any}
          onChange={handleRangeChange as any}
          allowClear
        />
        <Select
          allowClear
          placeholder="Trạng thái"
          style={{ width: 160, flexShrink: 0 }}
          value={params.status ?? undefined}
          onChange={(val) => onStatusChange(val as PurchaseOrderStatus | undefined)}
        >
          {Object.values(PurchaseOrderStatus).map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <Option key={s} value={s}>
                <Space size={6}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: cfg.dot }} />
                  {cfg.label}
                </Space>
              </Option>
            );
          })}
        </Select>
      </div>

      <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
        Tìm thấy <span style={{ fontWeight: 600, color: "#4F46E5" }}>{total}</span> phiếu nhập kho
      </p>
    </div>
  );
};

export default FilterBar;