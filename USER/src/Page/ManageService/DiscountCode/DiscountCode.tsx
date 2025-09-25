import Header from '@/Components/Header/Header';
import DiscountCodeTable from './component/DiscountCodeTable';

const DiscountCode = () => {
  return (
    <div className="p-6">
      <Header />
      <div className="flex items-center justify-center w-full h-16">
        <h1 className="text-2xl font-bold text-center text-gray-800">Tạo mã giảm giá</h1>
      </div>
      <DiscountCodeTable />
    </div>
  );
};

export default DiscountCode;
