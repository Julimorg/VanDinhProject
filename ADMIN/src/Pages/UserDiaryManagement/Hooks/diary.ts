export type GetDiaryRes = {
  id:            string;
  diaryName:     string;
  diaryStatus:   DiaryStatus;
  totalAmount:   number;
  totalQuantity: number;
  note:          string;
  createdBy:     string;
  createdAt:     string;
  updatedAt:     string;
  // diaryDate đã bỏ
};

export const DiaryStatus = {
  PAID:   "PAID",
  UNPAID: "UNPAID",
} as const;
export type DiaryStatus = typeof DiaryStatus[keyof typeof DiaryStatus];

export const STATUS_CONFIG: Record<DiaryStatus, { label: string; color: string; bg: string; dot: string }> = {
  [DiaryStatus.PAID]:   { label: "Đã thanh toán", color: "#2D7D5B", bg: "#D1FAE5", dot: "#2D7D5B" },
  [DiaryStatus.UNPAID]: { label: "Chưa thanh toán", color: "#C0392B", bg: "#FEE2E2", dot: "#C0392B" },
};

export type DiaryFilterParams = {
  search:    string;
  status?:   DiaryStatus;
  fromDate?: string;
  toDate?:   string;
  sortBy:    string;
  page:      number;
  pageSize:  number;
};

export const DEFAULT_FILTER: DiaryFilterParams = {
  search:   "",
  status:   undefined,
  fromDate: undefined,
  toDate:   undefined,
  sortBy:   "date_desc",
  page:     1,
  pageSize: 5,
};

export const SORT_OPTIONS = [
  { value: "date_desc",   label: "Mới nhất" },
  { value: "date_asc",    label: "Cũ nhất" },
  { value: "amount_desc", label: "Tiền cao nhất" },
  { value: "amount_asc",  label: "Tiền thấp nhất" },
];