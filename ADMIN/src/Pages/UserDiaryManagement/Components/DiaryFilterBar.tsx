import React from "react";
import { Input, Select, DatePicker, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { DiaryFilterParams, DiaryStatus, STATUS_CONFIG, SORT_OPTIONS } from "./diary";

const { RangePicker } = DatePicker;

interface DiaryFilterBarProps {
  params: DiaryFilterParams;
  total: number;
  onSearch: (val: string) => void;
  onStatusChange: (val: DiaryStatus | "") => void;
  onSortChange: (val: string) => void;
  onDateRangeChange: (from?: string, to?: string) => void;
  onReset: () => void;
}

const DiaryFilterBar: React.FC<DiaryFilterBarProps> = ({
  params, total, onSearch, onStatusChange, onSortChange, onDateRangeChange, onReset,
}) => {
  const rangeValue: [Dayjs, Dayjs] | undefined =
    params.fromDate && params.toDate
      ? [dayjs(params.fromDate), dayjs(params.toDate)]
      : undefined;

  const handleRange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates || (!dates[0] && !dates[1])) {
      onDateRangeChange(undefined, undefined);
    } else {
      onDateRangeChange(
        dates[0]?.format("YYYY-MM-DD"),
        dates[1]?.format("YYYY-MM-DD"),
      );
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex flex-col gap-3">
      {/* Row 1: search + reset */}
      <div className="flex flex-wrap gap-2">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm theo tên nhật ký, người tạo, ghi chú..."
          value={params.search}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 min-w-[220px]"
          style={{ borderRadius: 8 }}
        />
        <Button icon={<ReloadOutlined />} onClick={onReset} style={{ borderRadius: 8 }}>
          Đặt lại
        </Button>
      </div>

      {/* Row 2: filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex-shrink-0">
          <FilterOutlined /> Lọc
        </span>

        <RangePicker
          placeholder={["Từ ngày", "Đến ngày"]}
          format="DD/MM/YYYY"
          value={rangeValue as any}
          onChange={handleRange as any}
          allowClear
          className="flex-1 min-w-[240px]"
          style={{ borderRadius: 8 }}
        />

        <Select
          allowClear
          placeholder="Trạng thái"
          value={params.status || undefined}
          onChange={(val) => onStatusChange(val ?? "")}
          style={{ width: 200, borderRadius: 8 }}
          options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({
            value: k,
            label: (
              <Space size={6}>
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: v.dot }}
                />
                {v.label}
              </Space>
            ),
          }))}
        />

        <Select
          value={params.sortBy}
          onChange={onSortChange}
          style={{ width: 170, borderRadius: 8 }}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400">
        Tìm thấy <strong className="text-orange-600">{total}</strong> nhật ký
      </p>
    </div>
  );
};

export default DiaryFilterBar;