export enum DiaryStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
  CANCELLED = "CANCELLED",
}

// Khớp GetDiaryRes từ backend
export interface GetDiaryRes {
  id: string;
  diaryName: string;
  diaryStatus: DiaryStatus;
  diaryDate: string;        // LocalDate → "YYYY-MM-DD"
  totalAmount: number;      // BigDecimal → number
  totalQuantity: number;    // BigDecimal → number
  note: string;
  createdBy: string;
  createdAt: string;        // LocalDateTime → ISO string
  updatedAt: string;
}

export interface DiaryFilterParams {
  search: string;
  status: DiaryStatus | "";
  fromDate?: string;
  toDate?: string;
  sortBy: string;
  page: number;
  pageSize: number;
}

export const STATUS_CONFIG: Record<
  DiaryStatus,
  { label: string; color: string; bg: string; dot: string; barColor: string }
> = {
  [DiaryStatus.PAID]: {
    label: "Đã thanh toán",
    color: "#2D7D5B", bg: "#EBF5F0", dot: "#2D7D5B", barColor: "#2D7D5B",
  },
  [DiaryStatus.UNPAID]: {
    label: "Chưa thanh toán",
    color: "#C0392B", bg: "#FDECEA", dot: "#C0392B", barColor: "#C0392B",
  },
  [DiaryStatus.PARTIAL]: {
    label: "Thanh toán một phần",
    color: "#B45309", bg: "#FEF9EC", dot: "#B45309", barColor: "#B45309",
  },
  [DiaryStatus.CANCELLED]: {
    label: "Đã huỷ",
    color: "#8C8479", bg: "#F2F0ED", dot: "#8C8479", barColor: "#8C8479",
  },
};

export const SORT_OPTIONS = [
  { value: "date_desc",   label: "Mới nhất trước" },
  { value: "date_asc",    label: "Cũ nhất trước" },
  { value: "amount_desc", label: "Tiền cao nhất" },
  { value: "amount_asc",  label: "Tiền thấp nhất" },
];

export const PAGE_SIZE_OPTIONS = [6, 9, 12, 24];

export const DEFAULT_FILTER: DiaryFilterParams = {
  search: "",
  status: "",
  fromDate: undefined,
  toDate: undefined,
  sortBy: "date_desc",
  page: 1,
  pageSize: 9,
};