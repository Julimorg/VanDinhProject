export type TServiceItem = {
  origin_price: number;
  service_id: string;
  discount_type: 'PRICE' | 'PERCENTAGE' ;
  discount_value_another?: number | null;
  discount_value_vnd?: number ;
  service_name: string;
  service_description: string;
  discount_price?: number;
  service_type: string;
  image: string;
  is_Combo: boolean;
};

export type TServiceListResponse = {
  data: TServiceItem[];
  totalRecords: number;
  totalPage: number;
  page: number;
  offSet: number;
  nextPage: number | null;
  previousPage: number | null;
  stCode: number;
  msg: string;
};
