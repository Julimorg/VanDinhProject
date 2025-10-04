export type IApiResponsePagination<T> = {
    content: T,
    page: ApiPagination
}

type ApiPagination = {
    size: number,
    number: number,
    totalElements: number,
    totalPages: number,
}