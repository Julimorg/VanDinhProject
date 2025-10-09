
export type ICreateUserRequest = {
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    userImg: File,
    email: string,
    phone: string,
    userDob: string,
    userAddress: string,
    roles: string[]
}

export type ICreateUserResponse = {
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    userImg: string,
    phone: string,
    userAddress: string,
    userDob: string,
    roles: string[],
    createAt:string
}