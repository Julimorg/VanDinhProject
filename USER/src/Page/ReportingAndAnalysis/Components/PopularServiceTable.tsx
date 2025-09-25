const PopularServiceTable = () => {
  return (
    <table className="w-full text-left border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Dịch vụ</th>
          <th className="p-2">Loại vé</th>
          <th className="p-2">Số lượng bán</th>
          <th className="p-2">Tổng doanh thu</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t">
          <td className="p-2">Vé tắm bùn khoáng</td>
          <td className="p-2">Combo dịch vụ</td>
          <td className="p-2">1520</td>
          <td className="p-2">$6,400.00</td>
        </tr>
        <tr className="border-t">
          <td className="p-2">Vé vào cổng người lớn</td>
          <td className="p-2">Vé vào cổng</td>
          <td className="p-2">1980</td>
          <td className="p-2">$9,900.00</td>
        </tr>
        <tr className="border-t">
          <td className="p-2">Gói massage 60 phút</td>
          <td className="p-2">Dịch vụ lẻ</td>
          <td className="p-2">820</td>
          <td className="p-2">$4,100.00</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PopularServiceTable;
