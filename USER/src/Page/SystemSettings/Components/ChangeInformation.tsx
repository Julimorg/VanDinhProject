import { useState } from 'react';

const ChangeInformation = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCancel = () => {
    setName('');
    setEmail('');
  };

  const handleSave = () => {
    console.log('Saving:', { name, email });
    // Gọi API lưu hoặc xử lý logic ở đây
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="w-1/3 text-sm font-semibold text-gray-800">Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập họ tên"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/3 text-sm font-semibold text-gray-800">Thay đổi Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập email mới"
          />
        </div>
      </div>

      <hr className="my-6" />

      <p className="mb-6 font-semibold text-center text-gray-400">Chỉnh sửa thông tin của bạn</p>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-800 bg-white border border-gray-400 rounded-md hover:bg-gray-100"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Lưu lại
        </button>
      </div>
    </div>
  );
};

export default ChangeInformation;
