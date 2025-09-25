import Header from '@/Components/Header/Header';
import Table from './Components/Table'

const Users = () => {
  return (
    <div className="p-6">
        <Header />
        <div className="flex justify-center items-center w-full h-16">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
            Quản lý người dùng
        </h1>
        </div>

      <Table />
    </div>
  );
};

export default Users;
