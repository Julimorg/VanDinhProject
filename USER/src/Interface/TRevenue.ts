export type StatisticResponse = Record<
  string,
  {
    quantity: number;
    price: number;
    momo: number;
    cash: number;
  }
>;
export type ReceipterStatisticResponse = Record<
  string,
  {
    user_id: string;
    total_order: string;
    total_revenue: number;
    momo: number;
    cash: number;
  }
>;

export type ReceipterStatisticResponseData = {
  data: ReceipterStatisticResponse;
  totalRecords: number;
  totalPage: number;
  page: number;
  offSet: number;
  msg: string;
  stCode: number;
  nextPage: number | null;
  previousPage: number | null;
};

export type StatisticRequestExportExelFile = {
  fromDate: string;
  toDate: string;
};

export type ReceipterRequestExportExeilFile = {
  fromDate: string;
  toDate: string;
};


export type ReceipterStatisticDetailData = {
  service_name: string;
  service_price: number;
  momo: number;
  cash: number;
  quantity: number;
};

export type ReceipterStatisticDetailServices = {
  [serviceKey: string]: ReceipterStatisticDetailData[];
};

export type ReceipterStatisticDetailResponse = {
  [id: string]: {
    services: ReceipterStatisticDetailServices;
    totalAmount: number ;
  };
};