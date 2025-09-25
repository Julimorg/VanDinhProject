import { useNavigate } from 'react-router-dom';


function QuickAccess() {
  const navigate = useNavigate(); 
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          className="bg-white shadow p-4 rounded text-sm font-medium"
          onClick={() => navigate('/add-ticket')}
        >
          Tạo vé
        </button>
        <button
          className="bg-white shadow p-4 rounded text-sm font-medium"
          onClick={() => navigate('/discountedTickets')}
        >
          Mã giảm giá
        </button>
        <button
          className="bg-white shadow p-4 rounded text-sm font-medium"
          onClick={() => navigate('/reportingAndAnalysis')}
        >
          Báo cáo
        </button>
        <button
          className="bg-white shadow p-4 rounded text-sm font-medium"
          onClick={() => navigate('/shifts')}
        >
          Ca làm việc
        </button>
      </div>
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-sm font-semibold mb-2">
          Ca làm hiện tại <span className="text-green-600 text-xs">Hoạt động</span>
        </h2>
        <ul className="text-sm space-y-1">
          <li><strong>Time:</strong> 08:00 - 12:00</li>
          <li><strong>Staff:</strong> Số lượng: 2</li>
          <li><strong>Tổng vé đã bán:</strong> 123 vé</li>
        </ul>
      </div>
    </div>
  );
}

export default QuickAccess;
