import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { SettingFilled } from '@ant-design/icons';

export interface Device {
  id: number;
  name: string;
  type: string;
  model: string;
  position: string;
  status: 'active' | 'inactive';
}

interface DeviceTableProps {
  title: string;
  deviceData: Device[];
  addButtonText?: string;
  showActions?: boolean;
  onEdit?: (device: Device) => void;
  onDelete?: (device: Device) => void;
}

const DeviceTable: React.FC<DeviceTableProps> = ({
  title,
  deviceData,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">{title}</p>
      </div>
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Tìm kiếm thiết bị..."
        className="w-full mb-4 p-2 border rounded"
      />
      {/* <button>
        <span className="text-blue-600 hover:text-blue-800 font-semibold">
          Search
        </span>
      </button> */}
    </div>


      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Số thứ tự</th>
              <th className="border px-4 py-2">Tên thiết bị</th>
              <th className="border px-4 py-2">Loại</th>
              <th className="border px-4 py-2">Model</th>
              <th className="border px-4 py-2">Vị trí</th>
              <th className="border px-4 py-2">Trạng thái</th>
              {showActions && <th className="border px-4 py-2">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {deviceData.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{device.id}</td>
                <td className="border px-4 py-2">{device.name}</td>
                <td className="border px-4 py-2">{device.type}</td>
                <td className="border px-4 py-2">{device.model}</td>
                <td className="border px-4 py-2">{device.position}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      device.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {device.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                {showActions && (
                  <td className="border px-4 py-2">
                    <div className="flex gap-3 text-lg text-gray-600">
                      {onEdit && (
                        <button onClick={() => onEdit(device)} className="hover:text-blue-600">
                          <SettingFilled />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(device)} className="hover:text-red-600">
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceTable;
