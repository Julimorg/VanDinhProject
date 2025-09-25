export type ReqSearchTicket = {
    customer_email?: string,
    customer_phone_number?: string,
}

export type ResSearchTicker = {
  cart_id?: string,
  create_at?: string,
  customer_email?: string,
  customer_name?: string,
  customer_phone_number?: string,
  method?: string,
  org_name?: string,
  receipter_id?:string,
  total_price?: number,
}
export type SearchResponse =  ResSearchTicker[] | undefined;