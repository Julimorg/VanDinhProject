export type IUdpateMyProfileRequest = {
    firstName?: string | undefined; 
    lastName?: string | undefined; 
    userName?: string | undefined; 
    email: string; 
    phone?: string | undefined; 
    userDob?: string | undefined; 
    userImg?: File | undefined; 
    userAddress?: string | undefined; 
}

export type IUpdateMyProfileResponse = {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phone: string;
    userDob: string;
    userAddress: string;
    userImg: string;
    updateAt: string;    
}