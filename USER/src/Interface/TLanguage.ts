export type Language = {
  id: string;
  language_name: string;
  code: string;
}

export type LanguageResponse= {
  data: Language[];
  totalRecords: number;
  totalPage: number;
  page: number;
  offSet: number;
  nextPage: string | null;
  previousPage: string | null;
  stCode: number;
  msg: string;
}
