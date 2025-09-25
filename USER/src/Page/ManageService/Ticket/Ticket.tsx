import Header from '@/Components/Header/Header';
import TicketServiceManager from './Components/TableServiceManager';

const Ticket = () => {
  return (
    <div className="p-6">
      <Header />
      <div className="flex items-center justify-center w-full h-16">
        <h1 className="text-2xl font-bold text-center text-gray-800">Dịch vụ</h1>
      </div>
      <TicketServiceManager />
    </div>
  );
};

export default Ticket;
