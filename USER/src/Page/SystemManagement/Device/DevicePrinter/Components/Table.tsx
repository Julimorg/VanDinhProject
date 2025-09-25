import { useNavigate } from 'react-router-dom';
import DeviceTable from '@/Components/Table/DeviceTable';
import { Data } from './Data';

const TablePrinter = () => {
  const navigate = useNavigate();

  const PrinterDevices = Data.filter((device) => device.type === 'Máy in');

  return (
    <DeviceTable
      title="Danh sách máy in"
      deviceData={PrinterDevices}
      showActions
      onEdit={(device) => navigate(`/edit-printer/${device.id}`)}
      onDelete={(device) => navigate(`/delete-printer/${device.id}`)}
    />
  );
};

export default TablePrinter;
