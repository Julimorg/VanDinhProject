import { Spin } from 'antd';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-70 flex flex-col items-center justify-center space-y-4">
      <div className="flex space-x-4">
        <Spin size="large" />
      </div>
      <p className="text-xl font-semibold text-white">Loading...</p>
    </div>
  );
}
