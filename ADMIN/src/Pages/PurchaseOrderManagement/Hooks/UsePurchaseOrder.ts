import { useState, useMemo } from "react";
import { PurchaseOrderFilterParams } from "../purchaseOrder";
import { MOCK_PURCHASE_ORDERS } from "../mockdata";

const DEFAULT_PARAMS: PurchaseOrderFilterParams = {
  search: "",
  orderDateFrom: undefined,
  orderDateTo: undefined,
  status: "",
  page: 1,
  pageSize: 10,
};

export function usePurchaseOrders() {
  const [params, setParams] = useState<PurchaseOrderFilterParams>(DEFAULT_PARAMS);

  const { paged, total } = useMemo(() => {
    const q = params.search.trim().toLowerCase();

    const filtered = MOCK_PURCHASE_ORDERS.filter((o) => {
      const matchSearch =
        !q ||
        o.poCode.toLowerCase().includes(q) ||
        o.supplierName.toLowerCase().includes(q) ||
        o.createdBy.toLowerCase().includes(q);

      const matchStatus = !params.status || o.status === params.status;

      const oTime = new Date(o.orderDate).setHours(0, 0, 0, 0);
      const matchFrom = !params.orderDateFrom || oTime >= new Date(params.orderDateFrom).setHours(0, 0, 0, 0);
      const matchTo   = !params.orderDateTo   || oTime <= new Date(params.orderDateTo).setHours(23, 59, 59, 999);

      return matchSearch && matchStatus && matchFrom && matchTo;
    });

    const total = filtered.length;
    const paged = filtered.slice(
      (params.page - 1) * params.pageSize,
      params.page * params.pageSize
    );

    return { paged, total };
  }, [params]);

  const updateFilter = (patch: Partial<PurchaseOrderFilterParams>) => {
    setParams((prev) => ({ ...prev, ...patch, page: 1 }));
  };

  const changePage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const resetFilter = () => {
    setParams(DEFAULT_PARAMS);
  };

  return { params, orders: paged, total, updateFilter, changePage, resetFilter };
}