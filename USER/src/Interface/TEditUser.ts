export type EditUserRequest = {
    fullName: string,
    email: string,   
}


export type EditUserResposne = {
    value : {
        user_id: string,
        user_name: string,
        full_name: string,
        email: string,
        is_Active: boolean,
        org_id: string,
        org_name: string,
        org_description: string,
    }
}