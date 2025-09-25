export type GetUserResponse = {
    data: GetUserData[];
}

export type GetUserData = {
    id?: string,
    orgId?: string,
    email?: string,
    userName?: string,
    is_Active?: boolean | null,
    phoneNumber?: string | null,
    roles?: string[],
}