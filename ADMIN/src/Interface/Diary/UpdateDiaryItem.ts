export type IUpdateDiaryItemReq = {
    productName: string;
    quantity: number;
    unitPrice: number;
    itemNote?: string;
    color?: string;
    volume?: string;
}

export type IUpdateDiaryItemRes = {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    itemNote: string;
    color: string;
    volume: string;
    createAt: string;
    updateAt: string;

}