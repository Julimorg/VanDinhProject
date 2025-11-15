export type IRegisterRequest = {
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    email: string,
    phone: string,
    userDob: string,
    userAddress: string,
    
}

export type IRegisterResponse = {
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    email?: string | null,
    phone: string,
    userDob: string,
    userAddress: string,
}