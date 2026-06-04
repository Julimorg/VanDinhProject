export const DiaryStatus = {
  PAID:      "PAID",
  UNPAID:    "UNPAID",
} as const;
export type DiaryStatus = typeof DiaryStatus[keyof typeof DiaryStatus];

export const STATUS_CONFIG: Record<DiaryStatus, { label: string; color: string; bg: string; dot: string }> = {
  [DiaryStatus.PAID]:      { label: "Đã thanh toán",    color: "#2D7D5B", bg: "#D1FAE5", dot: "#2D7D5B" },
  [DiaryStatus.UNPAID]:    { label: "Chưa thanh toán",  color: "#C0392B", bg: "#FEE2E2", dot: "#C0392B" },
};

export type GetListItemsDiary = {
  id:        string;
  productId: string;
  productName: string;
  quantity:  number;
  volume:    string;
  color:     string;
  unitPrice: number;
  itemNote:  string;
  itemDate:  string;
  createdAt: string;
  updatedAt: string;
};

export type DiaryDayGroup = {
  date:      string;
  itemCount: number;
  totalDay:  number;
  items:     GetListItemsDiary[];
};

export type GetDiaryDetailRes = {
  id:            string;
  diaryName:     string;
  diaryStatus:   DiaryStatus;
  totalAmount:   number;
  totalQuantity: number;
  note:          string;
  days:          DiaryDayGroup[]; 
  createdBy:     string;
  createdAt:     string;
  updatedAt:     string;
};