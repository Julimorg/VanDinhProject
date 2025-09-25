import type { TQueryOperator, TQueryOperatorParent } from "@/Utils/queryBuilder";


export type TQueryCondition = {
  [key: string]: {
    value: string;
    queryOperator: TQueryOperator;
    queryOperatorParent: TQueryOperatorParent;
  };
};

export type TBuilderQuery = {
  toPaging?: {
    page: number;
    pageSize: number;
  };
  toJoin?: string[];
  // default isAsc === TRUE (sắp xếp tăng dần (cũ => mới) và ngược lại)
  // if have isAsc => requite orderBy
  isAsc?: boolean;
  orderBy?: string;

  appendQuery?: TQueryCondition[];
  prop?: {
    key: string;
    value: string;
  }[];
};
