const FilterForm = () => {
  return (
    <div className="p-4 space-y-4 bg-white rounded shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block mb-1 text-sm font-medium">Ngày bắt đầu</label>
          <input type="date" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Ngày kết thúc</label>
          <input type="date" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Chọn loại vé</label>
          <select className="w-full p-2 border rounded">
            <option>Chọn loại vé</option>
            <option>Vé vào cổng</option>
            <option>Vé dịch vụ</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Chọn kênh bán</label>
          <select className="w-full p-2 border rounded">
            <option>Chọn kênh bán</option>
            <option>Máy POS</option>
            <option>Online</option>
          </select>
        </div>
      </div>
      <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Tạo báo cáo
      </button>
    </div>
  );
};

export default FilterForm;
