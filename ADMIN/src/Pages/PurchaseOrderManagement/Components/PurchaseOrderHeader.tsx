import React from "react";
import { Button } from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";

interface PageHeaderProps {
  onCreateNew?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onCreateNew }) => {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200">
          <InboxOutlined className="text-white text-lg" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight m-0">
            Phiếu nhập kho
          </h1>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">
            Quản lý Purchase Order
          </p>
        </div>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="middle"
        onClick={onCreateNew}
        className="bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 rounded-lg font-semibold shadow-md shadow-indigo-200 flex-shrink-0"
      >
        Tạo phiếu mới
      </Button>
    </div>
  );
};

export default PageHeader;