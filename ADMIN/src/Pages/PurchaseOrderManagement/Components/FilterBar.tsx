import React from "react";
import {
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { STATUS_CONFIG } from "../mockdata";
import { PurchaseOrderFilterParams, PurchaseOrderStatus } from "../purchaseOrder";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FilterBarProps {
  params: PurchaseOrderFilterParams;
  onSearch: (value: string) => void;
  onStatusChange: (value: PurchaseOrderStatus | "") => void;
  onDateRangeChange: (from?: string, to?: string) => void;
  onReset: () => void;
  total: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  params,
  onSearch,
  onStatusChange,
  onDateRangeChange,
  onReset,
  total,
}) => {
  const handleRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (!dates || (!dates[0] && !dates[1])) {
      onDateRangeChange(undefined, undefined);
    } else {
      onDateRangeChange(
        dates[0]?.startOf("day").toISOString(),
        dates[1]?.endOf("day").toISOString()
      );
    }
  };

  const rangeValue: [Dayjs, Dayjs] | undefined =
    params.orderDateFrom && params.orderDateTo
      ? [dayjs(params.orderDateFrom), dayjs(params.orderDateTo)]
      : undefined;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      {/* Top row: search + reset */}
      <div className="flex items-center gap-2">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm theo mã PO, nhà cung cấp, người tạo..."
          className="flex-1 rounded-lg"
          value={params.search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Tooltip title="Đặt lại bộ lọc">
          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            className="flex-shrink-0"
          />
        </Tooltip>
      </div>

      {/* Bottom row: filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs flex-shrink-0">
          <FilterOutlined />
          <span>Bộ lọc</span>
        </div>

        {/* Date range */}
        <RangePicker
          className="flex-1 min-w-0"
          placeholder={["Từ ngày đặt hàng", "Đến ngày"]}
          format="DD/MM/YYYY"
          value={rangeValue as any}
          onChange={handleRangeChange as any}
          allowClear
        />

        {/* Status */}
        <Select
          allowClear
          placeholder="Trạng thái"
          className="w-full sm:w-44 flex-shrink-0"
          value={params.status || undefined}
          onChange={(val) => onStatusChange(val ?? "")}
        >
          {Object.values(PurchaseOrderStatus).map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <Option key={s} value={s}>
                <Space size={6}>
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: cfg.dot }}
                  />
                  {cfg.label}
                </Space>
              </Option>
            );
          })}
        </Select>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400 leading-none">
        Tìm thấy{" "}
        <span className="font-semibold text-indigo-600">{total}</span> phiếu nhập kho
      </p>
    </div>
  );
};

export default FilterBar;