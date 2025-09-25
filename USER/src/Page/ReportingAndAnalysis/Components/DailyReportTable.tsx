const DailyReportTable = () => {
  return (
    <table className="w-full text-left border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Ngày</th>
          <th className="p-2">Vé đã bán</th>
          <th className="p-2">Doanh thu</th>
          <th className="p-2">Tiền mặt</th>
          <th className="p-2">Momo</th>
          <th className="p-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t">
          <td className="p-2">1/5/2025</td>
          <td className="p-2">320</td>
          <td className="p-2">$25.00</td>
          <td className="p-2">$25.00</td>
          <td className="p-2">$25.00</td>
          <td className="p-2 text-right">
            <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
              Xóa
            </button>
          </td>
        </tr>
        <tr className="border-t">
          <td className="p-2">15/5/2025</td>
          <td className="p-2">440</td>
          <td className="p-2">$15.00</td>
          <td className="p-2">$25.00</td>
          <td className="p-2">$25.00</td>
          <td className="p-2 text-right">
            <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default DailyReportTable;
