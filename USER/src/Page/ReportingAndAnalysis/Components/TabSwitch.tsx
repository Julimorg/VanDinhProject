const TabSwitch = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'daily' | 'popular';
  setActiveTab: (tab: 'daily' | 'popular') => void;
}) => {
  return (
    <div className="space-x-2">
      <button
        onClick={() => setActiveTab('daily')}
        className={`px-4 py-2 rounded ${
          activeTab === 'daily' ? 'bg-blue-600 text-white' : 'border hover:bg-gray-100'
        }`}
      >
        Báo cáo hàng ngày
      </button>
      <button
        onClick={() => setActiveTab('popular')}
        className={`px-4 py-2 rounded ${
          activeTab === 'popular' ? 'bg-blue-600 text-white' : 'border hover:bg-gray-100'
        }`}
      >
        Dịch vụ phổ biến
      </button>
    </div>
  );
};

export default TabSwitch;
