export type IUpdateDiaryStatusReq = {
  diaryStatus: string;   
}

export type IUpdateDiaryStatusRes = {
    id: string;
    diaryName: string;
    diaryStatus: string;
    note: string;
    updatedAt: string;
}