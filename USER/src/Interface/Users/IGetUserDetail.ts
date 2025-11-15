
export type IGetUserDetailResponse = {
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    userImg: string,
    phone: string,
    userAddress: string,
    userDob: string,
    status: string,
    roles: UsersRole[],
    orders: UserOrders[],
    creatAt: string,
    updateAt: string,
}

export type UsersRole = {
    name: string,
    description: string,
}

export type UserOrders = {
    orderId: string,
    orderCode: string,
    shipAddress: string,
    orderAmount: number,
    orderStatus: string,
    paymentMethod: string,
    createBy: string,
    approvedBy: string,
    canceledBy: string,
    createAt: string,
    updateAt: string,
    deleteAt: string,
    compeletAt: string
}