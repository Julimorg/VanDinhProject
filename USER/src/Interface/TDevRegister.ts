export type  DevRegisterRequest = {
    username: string,
    fullname: string,
    email: string,
    password: string,
    role: string,
    permission_id?: string[];
}

export type DevRegisterResposne = {
    data : DevReigsterData[]
}

export type DevReigsterData = {
    user_id?: string,
    user_name?: string,
    full_name?: string,
    phone_num?: string | null,
    is_Active?: boolean | null,
    email?: string,
    org_id?: string,
    org_name?: string,
    org_description?: string,
}