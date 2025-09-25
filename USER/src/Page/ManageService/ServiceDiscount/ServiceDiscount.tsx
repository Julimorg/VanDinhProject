import Header from '@/Components/Header/Header';
import DiscountTableData from './Component/ServiceDiscountTable';
import { useGetDiscountService } from './hook/usegetDiscountService';

const ServiceDiscount = () => {
  const { data, isLoading, refetch } = useGetDiscountService();

  return (
    <div className="p-6">
      <Header />

      <div className="flex items-center justify-center w-full h-16 mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Dịch vụ đang giảm giá</h1>
      </div>

      <DiscountTableData data={data?.data || []} isLoading={isLoading} onRefresh={refetch} />
    </div>
  );
};

export default ServiceDiscount;
