export type IUpdateUserRequest = {
    firstName?: string,
    lastName?: string,
    userName?: string,
    userImg?: File,
    email?: string,
    phone?: string,
    userDob?: string
    userAddress?: string,
    status: string,
    roles: string[]
}

export type IUpdateUserResponse = {
    firstName: string,
    lastName: string,
    userName: string,
    userImg: File,
    email: string,
    phone: string,
    userDob: string
    userAddress: string,
    status: string,
    roles: UsersRole[],
    updateAt: string,
}

export type UsersRole = {
    name: string,
    description: string,
}