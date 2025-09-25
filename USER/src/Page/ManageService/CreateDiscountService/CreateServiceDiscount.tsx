import Header from '@/Components/Header/Header';
import DiscountServiceManager from './Components/TicketTable';

const CreateServiceDiscount = () => {
  return (
    <div className="p-6">
      <Header />
      <div className="flex items-center justify-center w-full h-16">
        <h1 className="text-2xl font-bold text-center text-gray -800">Thêm khuyến mãi dịch vụ</h1>
      </div>
      <DiscountServiceManager />
    </div>
  );
};

export default CreateServiceDiscount;
