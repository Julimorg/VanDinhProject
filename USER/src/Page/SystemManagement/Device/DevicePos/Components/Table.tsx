import { useNavigate } from 'react-router-dom';
import DeviceTable from '@/Components/Table/DeviceTable';
import { Data } from './Data';

const TablePos = () => {
  const navigate = useNavigate();

  const PosDevices = Data.filter((device) => device.type === 'Máy POS');

  return (
    <DeviceTable
      title="Danh sách máy POS"
      deviceData={PosDevices}
      showActions
      onEdit={(device) => navigate(`/edit-pos/${device.id}`)}
      onDelete={(device) => navigate(`/delete-pos/${device.id}`)}
    />
  );
};

export default TablePos;
