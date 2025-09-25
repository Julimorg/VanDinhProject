import { useState } from 'react';
import { Input } from 'antd';
import Header from '@/Components/Header/Header';
import TransactionTableData from './Components/TransactionTableData';

import type { ResSearchTicker } from '@/Interface/TSearchTicket';
import { useSearchTicket } from './Hooks/useSearchTicket';
import { toast } from 'react-toastify';
import TextBigTitle from '@/Components/TextBigTitle/TextBigTitle';

const Transaction = () => {
  const [searchResults, setSearchResults] = useState<ResSearchTicker[]>([]);

  const { mutate: searchTicket, isPending } = useSearchTicket({
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
        toast.info('Không tìm thấy kết quả phù hợp.');
      }
    },
    onError: () => {
      toast.error('Tìm kiếm thất bại. Vui lòng thử lại.');
    },
  });
  console.log(searchResults.length);

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      toast.warning('Vui lòng nhập email hoặc số điện thoại để tìm kiếm.');
      return;
    }

    const params = {
      customer_email: trimmedValue,
      customer_phone_number: trimmedValue,
    };

    searchTicket(params);
  };

  return (
    <div className="p-6">
      <Header />
      <div className="flex items-center justify-center w-full h-16">
        <h1 className="text-2xl font-bold text-center text-gray-800">Quản lý giao dịch</h1>
      </div>
      <div className="mb-4 flex justify-center">
        <Input.Search
          placeholder="Tìm kiếm theo email hoặc số điện thoại..."
          onSearch={handleSearch}
          enterButton="Tìm kiếm"
          size="large"
          style={{ maxWidth: 500 }}
          allowClear
          loading={isPending}
        />
      </div>

      {searchResults.length == 0 ? (
        <>
          <div className='mt-10'>
            <TextBigTitle
              $fontSize="30px"
              $color="#d9d9d9"
              $fontWeight="300"
              $textalign="center"
              title="Vui lòng nhập thông tin tìm kiếm"
            />
          </div>
        </>
      ) : (
        <TransactionTableData data={searchResults} isLoading={isPending} />
      )}
    </div>
  );
};

export default Transaction;
