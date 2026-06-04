export type ICreateDiaryRequest = {

    diaryName: string;

    note: string;

}

export type ICreateDiaryResponse = {
    id: string;

    diaryName: string;

    diaryStatus: string;

    totalAmount: number;

    totalQuantity: number;

    note: string;

    createdBy: string;

    createdAt: string;
    
    updatedAt: string;
}