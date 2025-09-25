export interface DiscountServiceItem {
  service_id: string;
  service: any | null;
  service_name:string
  discount_type: 'PERCENTAGE' 
  start_date: string;
  end_date: string;
  apply_for_target: 'ADULT' | 'CHILDREN' 
  discount_value_vnd: number;
  discount_value_another: number | null;
  id: string;
}

export interface GetDiscountServiceResponse {
  data: DiscountServiceItem[];
  totalRecords: number;
  totalPage: number;
  page: number;
  offSet: number;
  nextPage: number | null;
  previousPage: number | null;
  stCode: number;
  msg: string;
}


export type CreateDiscountService = {
  service_id: string;            
  start_date: string;            
  end_date: string;              
  discount_type: 'PERCENTAGE' 
  discount_value_vnd: number;  
  apply_for_target: 'ADULT' | 'CHILDREN';
}

export type EditDiscountService ={
    start_date:string
    end_date:string
    discount_type:string
    apply_for_target:string
    discount_value_vnd:string
    discount_value_another?:string
}




export type DiscountServiceRs ={
    stcode:string
    msg:string
    
}