
export type CustomerType = 'ADULT' | 'CHILDREN' ; 

export type  ServiceItem ={
  service_id: string;
  quantity: number;
  price: number;
  customerType?: CustomerType;
  discount_code?:string;
}

export type  OrderPayload= {
  services: ServiceItem[];
  customer_phone_number?: string;
  customer_email?: string;
  customer_name?: string;
  
}

export type OrderedService ={
  name: string;
  description: string;
  price: number;
  quantity: number;
  customer_type: CustomerType;
}

export type OrderResponse ={
  services: OrderedService[];
  receipter_name: string;
  cart_id: string;
  create_at: string; 
  total_price: number;
  customer_phone_number?: string;
  customer_email?: string;
  customer_name?: string;
}
