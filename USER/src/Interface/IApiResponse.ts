export type IApiResponse<T> = {
    status_code?: number,
    message?: string,
    data: T,
    timestamp?: string,
}