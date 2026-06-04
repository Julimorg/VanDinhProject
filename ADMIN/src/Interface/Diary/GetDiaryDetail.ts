
export type IGetDiaryDetailRes = {

    id: string;

    diaryName: string;
    
    diaryStatus: string;

    totalAmount: number;

    totalQuantity: number;

    note: string;

    createdBy: string;

    days: IDiaryDayGroup[];

    createdAt: string;     

    updateAt: string;

}

type IDiaryDayGroup = {

    date: string;

    itemCount: number;

    totalDay: number;

    items:  IGetListItemsDiary[];

}

type IGetListItemsDiary = {

    id: string;

    productId: string;
    
    productName: string;

    quantity: number;

    volume: string;

    color: string;

    unitPrice: number;

    itemNote: string;

    itemDate: string;

    createdAt: string;

    updatedAt: string;
}