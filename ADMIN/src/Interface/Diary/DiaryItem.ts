export type ICreateDiaryItemReq = {

    productName: string;
    
    quantity: number
    
    unitPrice: number;
    
    itemDate: string;

    itemNote: string;

    color: string;

    volume: string;

}

export type ICreateDiaryItemRes = {
    id: string;
    diaryName: string;
    totalQuantity: number;
    totalAmount: number;
    items: ListDiaryItemRes[];
    createAt: string;
    updateAt: string;
}

export type ListDiaryItemRes = {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    volume: string;
    color: string;
    unitPrice: number;
    itemNote: string;
    createAt: string;
    updateAt: string;
}