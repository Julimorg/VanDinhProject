import Header from '@/Components/Header/Header';
import PermissionTable from './Components/PermissionTable';
const Permission = () => {
  return (
    <div className="p-6">
      <Header />
      <div className="flex items-center justify-center w-full h-16">
        <h1 className="text-2xl font-bold text-center text-gray-800">Phân quyền</h1>
      </div>
      <PermissionTable />
    </div>
  );
};

export default Permission;
