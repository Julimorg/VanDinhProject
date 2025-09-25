export type TPage<T> = {
  totalRecords: number;
  totalPage: number;
  page: number;
  offSet: number;
  nextPage: null | boolean;
  previousPage: null | boolean;
  data: T[];
};

export type TResponse<T> = {
  message: string;
  data: T;
};
export type TOpen<T> = {
  isOpen: boolean;
  type?: T;
};
