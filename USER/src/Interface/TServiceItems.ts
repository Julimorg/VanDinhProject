export type TServiceItem = {
  origin_price: number;
  service_id?: string;
  client_id?:string
  discount_type:'PERCENTAGE' | null;
  discount_value_another: number | null;
  discount_value_vnd: number | null;
  service_name?: string;
  name?: string;
  service_description?: string;
  discount_price: number;
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



export type ServiceUpdate = {
  language_id?:string;
  name:string
  price:string
  type:string
  description:string
  image:string
  translate_name?:string
  translate_type?:string
  translate_description?:string
}


export type DetailService ={
  is_Available:string;
  name:string
  price:string
  type:string
  description:string
  image:string
  is_Combo:boolean
  translateServices?:TranslateEng[]
}

export type TranslateEng={
  language_id:string
  translate_name:string
  translate_price:string
  translate_type:string
  translate_description:string
}


export type DeleteserviceRs={
  stCode:string
  msg:string
}

export type ServiceCreate = {
  language_id: string;
  name: string;
  price: number;
  type: string;
  description: string;
  image: string | File; 
  customer_type: 'ADULT' | 'CHILD'; 

  translate_name: string;
  translate_price: number;
  translate_type: string;
  translate_description: string;
};
