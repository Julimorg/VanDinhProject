import { useNavigate } from 'react-router-dom';
import DeviceTable from '@/Components/Table/DeviceTable';
import { Data } from './Data';

const TableKiosk = () => {
  const navigate = useNavigate();

  const kioskDevices = Data.filter((device) => device.type === 'Máy Kiosk');

  return (
    <DeviceTable
      title="Danh sách Kiosk"
      deviceData={kioskDevices}
      showActions
      onEdit={(device) => navigate(`/edit-kiosk/${device.id}`)}
      onDelete={(device) => navigate(`/delete-kiosk/${device.id}`)}
    />
  );
};

export default TableKiosk;
