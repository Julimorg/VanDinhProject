import type { TQueryCondition } from "@/Interface/TBuilderQuery";


export type TQueryOperator =
  | '$eq' // bằng vd: a === b (id === 123)
  | '$neq' // không bằng vd a != b (id != 123)
  | '$gt' // so sánh lớn hơn vd: current time > data time
  | '$gte' //  so sánh lớn hơn hoặc bằng vd: current time >= data time
  | '$lt' // so sánh bé vd: current time < data time
  | '$lte' // so sánh bé hơn hoặc bằng vd: current time =< data time

  // $fli: tìm kiếm theo kiểu contains
  // vd a= ban qui; b = so van ban qui 1 => a co trong b
  | '$fli'
  // $fsw: tìm kiếm theo kiểu bắt đầu
  // vd a= so van; b = so van ban qui 1 => b bat dau tu a
  | '$fsw'
  // $few: tìm kiếm theo kiểu kết thúc
  // vd a= qui 1 ; b = so van ban qui 1 => b ket thuc bang a
  | '$few';

export type TQueryOperatorParent =
  | '$and' // so sanh bằng và  chứa các TQueryOperator
  | '$or'; // so sánh hoặc và chứa các TQueryOperator

export const buildQuery = (
  appendQuery: TQueryCondition[],
  propQuery?: { key: string; value: string }[]
) => {
  const queryObj: Record<string, any> = {};
  // First, filter out conditions with empty or null values
  const filteredQuery = appendQuery.filter((item) => {
    const key = Object.keys(item)[0];
    const condition = item[key];
    return condition.value !== '' && condition.value !== null;
  });

  const groupedByParent = filteredQuery.reduce((acc: Record<string, TQueryCondition[]>, item) => {
    const key = Object.keys(item)[0]; // lấy key (ví dụ: sessionId)
    const condition = item[key]; // lấy object condition
    const parent = condition.queryOperatorParent; // lấy toán tử cha ($and/$or)

    if (!acc[parent]) {
      acc[parent] = [];
    }
    acc[parent].push(item);
    return acc;
    // groupedByParent =>  nhóm các điều kiện theo toán tử cha ($and/$or):
    // {
    //   '$and': [/* các điều kiện có queryOperatorParent là $and */],
    //   '$or': [/* các điều kiện có queryOperatorParent là $or */]
    // }
  }, {});

  // Process each parent operator group
  Object.entries(groupedByParent).forEach(([parent, conditions]) => {
    // Further group by queryOperator within each parent
    const groupedByOperator = conditions.reduce((acc: Record<string, any[]>, condition) => {
      const key = Object.keys(condition)[0]; // lấy key (ví dụ: sessionId)
      const { queryOperator, value } = condition[key]; // lấy operator và value

      if (!acc[queryOperator]) {
        acc[queryOperator] = [];
      }

      acc[queryOperator].push({
        key: key,
        val: value,
      });

      return acc;
    }, {});
    // Với mỗi nhóm parent ($and/$or), tiếp tục nhóm theo queryOperator ($eq, $gte,...)
    // Chuyển đổi mỗi điều kiện thành format {key, val}

    // groupedByOperator = "$and": {
    //   "$eq": [
    //     { key: "sessionId", val: "0192af39-f577-7b7e-8943-69bea6404683" }
    //   ]
    // },
    // "$or": {
    //   "$eq": [
    //     { key: "sessionId", val: "12" },
    //     { key: "sessionId", val: "35" }
    //   ],
    // }
    queryObj[parent] = groupedByOperator;
  });

  // console.log(queryObj);

  // Convert query object to string
  let queryString = `s=${JSON.stringify(queryObj)}`;

  if (propQuery) {
    const propArray = propQuery.map((item) => {
      return {
        key: item.key,
        value: item.value,
      };
    });
    queryString += `prop=${JSON.stringify(propArray)}`;
  }
  return queryString;
};

export const toJoin = (joinQuery: string, value: string) => {
  if (joinQuery === 's={}') {
    joinQuery = '';
  }
  if (joinQuery.length > 2) {
    joinQuery += '&';
  }
  // console.log(joinQuery, value);
  joinQuery += 'p=' + value;
  return joinQuery;
};
export const toPaging = (currentPage: number, limit: number = 1, query: string = '') => {
  if (query === 's={}') {
    query = '';
  }
  if (query.length > 4) {
    query += `&`;
  }
  query += `page=${currentPage}&limit=${limit}`;
  return query;
};

export const toOrderBy = (orderBy: string, query: string = ''): string => {
  // Nếu query chỉ chứa "s={}" thì xóa nó
  if (query === 's={}') {
    query = '';
  }
  // Nếu chuỗi query có nhiều hơn 4 ký tự (tức là đã có tham số khác), thêm "&" để nối tham số mới
  if (query.length > 4) {
    query += `&`;
  }
  // Thêm tham số orderBy vào chuỗi query
  query += `orderBy=${orderBy}`;
  return query;
};
export const toIsAsc = (isAsc: string, query: string = ''): string => {
  // Nếu query chỉ chứa "s={}" thì xóa nó
  if (query === 's={}') {
    query = '';
  }
  // Nếu chuỗi query có nhiều hơn 4 ký tự (tức là đã có tham số khác), thêm "&" để nối tham số mới
  if (query.length > 4) {
    query += `&`;
  }
  // Thêm tham số isAsc vào chuỗi query
  query += `isAsc=${isAsc}`;
  return query;
};