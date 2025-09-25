export type DiscountCodeItem= {
  discount_code: string;
  service_id: string | null;
  value_percentage: number | null;
  total: number | null;
  available_number: number | null;
  used_number: number;
  org_name: string;
  is_Available: boolean;
  start_date: string | null;
  end_date: string | null;
  create_at: string;
  id: string;
}

export type DiscountCodeRs= {
  data: DiscountCodeItem[];
  totalRecords: number;
  totalPage: number;
  page: number;
  offSet: number;
  nextPage: number | null;
  previousPage: number | null;
  stCode: number;
  msg: string;
}



export type CodeRemoveRs={
  stCode:string
  msg:string
}


export type DiscountCodeUpdate ={
  discount_code: string;
  value_percentage?: number;
  total?: number;
  available_number?: number;
  used_number?: number;
  start_date: string; 
  end_date: string;   
 
}


export type  ServiceList= {
  service_id: string;
  service_name: string;
}
