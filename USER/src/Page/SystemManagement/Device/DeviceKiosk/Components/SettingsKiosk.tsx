import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormState {
  ip: string;
  note: string;
  port: string;
  protocol: string;
}

const SettingsKiosk: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    ip: '',
    note: '',
    port: '',
    protocol: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<FormState> = {};
    if (!form.ip) newErrors.ip = 'Vui lòng nhập địa chỉ IP';
    if (!form.port) newErrors.port = 'Vui lòng chọn cổng';
    if (!form.protocol) newErrors.protocol = 'Vui lòng chọn giao thức';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Gửi dữ liệu:', form);
      // TODO: Gửi dữ liệu đến API
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[500px] bg-white p-6 rounded-lg shadow-lg mx-auto"
    >
      <h2 className="text-center text-lg font-semibold mb-6">Cấu hình thiết bị</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Địa chỉ IP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ip"
            value={form.ip}
            onChange={handleChange}
            placeholder="192.168.1.100"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.ip ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.ip && <p className="text-red-500 text-xs mt-1">{errors.ip}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ghi chú cấu hình</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Nhập ghi chú cấu hình"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Cổng <span className="text-red-500">*</span>
          </label>
          <select
            name="port"
            value={form.port}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.port ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn loại cổng</option>
            <option value="9100">9100</option>
            <option value="9200">9200</option>
          </select>
          {errors.port && <p className="text-red-500 text-xs mt-1">{errors.port}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Giao thức <span className="text-red-500">*</span>
          </label>
          <select
            name="protocol"
            value={form.protocol}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.protocol ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn giao thức</option>
            <option value="TCP">TCP</option>
            <option value="IP">IP</option>
          </select>
          {errors.protocol && (
            <p className="text-red-500 text-xs mt-1">{errors.protocol}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate('/deviceKiosk')}
          className="px-5 py-2 border rounded-md text-gray-800 bg-gray-100 hover:bg-gray-200"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
        >
          Lưu cấu hình
        </button>
      </div>
    </form>
  );
};

export default SettingsKiosk;
