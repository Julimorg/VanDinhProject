export type TransactionDetailResponse = {
    cart_id?: string,
    customer_phone_number?: string,
    customer_email?: string,
    create_at?: string,
    method?: string,
    total_price?: number,
    customer_name?: string,
    data?: TransactionDetailResponseData[] ,
}

export type TransactionDetailResponseData = {
    service_price?: number,
    service_name?: string,
    quantity?: number,
    org_name?: string,
    create_at?: string,
}