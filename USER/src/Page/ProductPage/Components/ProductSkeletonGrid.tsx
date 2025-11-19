import { Card } from "antd";

export const ProductSkeletonGrid = () => (
  <Card className="rounded-2xl overflow-hidden">
    <div className="bg-gray-200 h-64 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded animate-pulse" />
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse mt-6" />
    </div>
  </Card>
);