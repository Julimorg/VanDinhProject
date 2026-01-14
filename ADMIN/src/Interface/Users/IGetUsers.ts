export type IUsersResponse = {
    id: string,
    userName: string,
    firstName: string,
    lastName: string,
    phone: string,
    userAddress: string;
    userDob: string;
    email: string,
    userImg: string,
    status: string,
    roles: UserRoles[],
    createAt: string,
    updateAt: string,
}

export type UserRoles = {
    name: string,
    description: string,
}