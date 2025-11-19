import { Card } from "antd";

export const ProductSkeletonList = () => (
  <Card className="rounded-2xl">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="bg-gray-200 rounded-xl w-full md:w-80 h-64 animate-pulse" />
      <div className="flex-1 space-y-4 py-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse mt-8" />
      </div>
    </div>
  </Card>
);