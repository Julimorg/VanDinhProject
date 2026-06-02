import React from "react";
import { DiaryStatus, GetDiaryRes } from "./diary";

interface DiaryStatsRowProps {
  data: GetDiaryRes[];
}

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const DiaryStatsRow: React.FC<DiaryStatsRowProps> = ({ data }) => {
  const totalAmt     = data.reduce((s, d) => s + d.totalAmount, 0);
  const paidCount    = data.filter(d => d.diaryStatus === DiaryStatus.PAID).length;
  const unpaidCount  = data.filter(d => d.diaryStatus === DiaryStatus.UNPAID).length;
  const partialCount = data.filter(d => d.diaryStatus === DiaryStatus.PARTIAL).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        label="Tổng nhật ký"
        value={String(data.length)}
        meta="tất cả giao dịch"
      />
      <StatCard
        label="Tổng doanh thu"
        value={fmtVND(totalAmt)}
        meta="ghi nhận từ nhật ký"
        valueClass="text-emerald-700 text-base"
      />
      <StatCard
        label="Đã thanh toán"
        value={String(paidCount)}
        meta="hoàn tất"
        dotColor="#2D7D5B"
        valueClass="text-emerald-700"
      />
      <StatCard
        label="Còn nợ"
        value={String(unpaidCount + partialCount)}
        meta={`${unpaidCount} chưa trả · ${partialCount} một phần`}
        dotColor="#C0392B"
        valueClass="text-red-600"
      />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  meta: string;
  dotColor?: string;
  valueClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, meta, dotColor, valueClass = "" }) => (
  <div className="bg-white border border-gray-100 rounded-xl px-4 py-4 shadow-sm flex flex-col gap-1.5">
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-bold text-gray-800 leading-none ${valueClass}`}>{value}</p>
    <p className="text-[11px] text-gray-400 flex items-center gap-1">
      {dotColor && (
        <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
      )}
      {meta}
    </p>
  </div>
);

export default DiaryStatsRow;