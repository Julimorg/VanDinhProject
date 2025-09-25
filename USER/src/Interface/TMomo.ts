export type MomoResponse = {
    momoDomain: string,
    partnerCode: string,
    redirectUrl: string,
    ipnUrl: string,
    secretKey: string,
    accessKey: string,
    org_name: string,
    id: string,
}
export type MomoUpdateRequest ={
    momoDomain?: string,
    partnerCode?: string,
    redirectUrl?: string,
    ipnUrl?: string,
    secretKey?: string,
    accessKey?: string,
    org_name?: string,
    id?: string,
}
export type MomoAddRequest ={
    momoDomain: string,
    partnerCode: string,
    redirectUrl: string,
    ipnUrl: string,
    secretKey: string,
    accessKey: string,
    org_name: string,
    id: string,
}