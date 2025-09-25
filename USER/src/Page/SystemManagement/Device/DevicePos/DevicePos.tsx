import Header from '@/Components/Header/Header';
import Table from './Components/Table';

const DevicePos = () => {
  return (
    <div className="p-6">
      <Header />
      <div className="flex items-center justify-center w-full h-16">
        <h1 className="text-2xl font-bold text-center text-gray-800">Quản lý thiết bị</h1>
      </div>

      <Table />
    </div>
  );
};

export default DevicePos;
