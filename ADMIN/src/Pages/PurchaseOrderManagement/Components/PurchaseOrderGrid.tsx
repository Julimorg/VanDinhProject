import React from "react";
import { Skeleton, Empty } from "antd";
import PurchaseOrderCard from "./PurchaseOrderCard";
import { GetPurchaseOrderRes } from "../purchaseOrder";

interface PurchaseOrderGridProps {
  orders: GetPurchaseOrderRes[];
  loading: boolean;
  onView?: (order: GetPurchaseOrderRes) => void;
  onEdit?: (order: GetPurchaseOrderRes) => void;
}

const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="h-1.5 bg-gray-100" />
    <div className="p-4 pl-7 flex flex-col gap-3">
      <div className="flex justify-between">
        <Skeleton.Input active size="small" style={{ width: 120 }} />
        <Skeleton.Button active size="small" style={{ width: 70 }} />
      </div>
      <div className="border-t border-dashed border-gray-100" />
      <Skeleton active paragraph={{ rows: 3 }} title={false} />
    </div>
    <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 flex justify-end gap-2">
      <Skeleton.Button active size="small" style={{ width: 60 }} />
      <Skeleton.Button active size="small" style={{ width: 60 }} />
    </div>
  </div>
);

const PurchaseOrderGrid: React.FC<PurchaseOrderGridProps> = ({
  orders,
  loading,
  onView,
  onEdit,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex items-center justify-center py-24">
        <Empty
          description={
            <span className="text-gray-400">
              Không tìm thấy phiếu nhập kho nào
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map((order) => (
        <PurchaseOrderCard
          key={order.purchaseOrderId}
          order={order}
          onView={onView}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default PurchaseOrderGrid;