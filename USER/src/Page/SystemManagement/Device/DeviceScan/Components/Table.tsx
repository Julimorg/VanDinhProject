import { useNavigate } from 'react-router-dom';
import DeviceTable from '@/Components/Table/DeviceTable';
import { Data } from './Data';

const TableScan = () => {
  const navigate = useNavigate();

  const ScanDevices = Data.filter((device) => device.type === 'Máy Scan');

  return (
    <DeviceTable
      title="Danh sách máy Scan"
      deviceData={ScanDevices}
      showActions
      onEdit={(device) => navigate(`/edit-scan/${device.id}`)}
      onDelete={(device) => navigate(`/delete-scan/${device.id}`)}
    />
  );
};

export default TableScan;
