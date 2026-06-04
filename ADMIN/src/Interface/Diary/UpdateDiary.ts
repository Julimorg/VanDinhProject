export type IUpdateDiaryReq = {
    diaryName: string;
    note?: string;
}

export type IUpdateDiaryRes = {
    id: string;
    
    diaryName: string;

    note: string;

    updateAt: string;
}


    