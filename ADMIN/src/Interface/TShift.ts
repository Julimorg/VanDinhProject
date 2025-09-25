export type OnShift =  {
    start_time?: string,
    end_time?: string,
    transaction?: Transaction[] | null,
}

export type OffShift = {
    start_time?: string,
    end_time?: string,
    transaction?: Transaction[] | null,
}

export type Transaction = {
    id?: string,
    method?: string,
    cart_id?: string,
    total_price?: number,
    customer_phone_number?: string,
    customer_email?: string,
    customer_name?:string,
    create_at?: string,
}
