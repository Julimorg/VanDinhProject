// import { useState } from 'react';
import Header from '@/Components/Header/Header';
// import TabSwitcher from './Components/TabSwitcher';

const SystemSettings = () => {
  // const [activeTab, setActiveTab] = useState('DoiThongTin'); // mặc định tab đầu tiên

  return (
    <div className="p-6">
      <Header />
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-800">Cài đặt hệ thống</h1>
        <div className="flex justify-center">
          {/* <TabSwitcher activeTab={activeTab} onChange={setActiveTab} /> */}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
