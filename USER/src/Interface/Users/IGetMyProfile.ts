import type { UserStatus } from "../../Enum/UserStatus";

export type IGetMyProfileResponse = {
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    userImg: string,
    phone: string,
    userAddress: string,
    userDob: string,
    status: UserStatus,
    createAt: string,
    updateAt: string,
}
