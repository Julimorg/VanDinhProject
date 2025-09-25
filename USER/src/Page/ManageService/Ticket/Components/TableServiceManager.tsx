import React, { useState, useMemo } from 'react';
import { Radio, Checkbox } from 'antd';
import { useAuthStore } from '@/Store/auth';
import { useService } from '../hook/usegetService';
import ServiceTable from '@/Components/Table/Servicetable';
import type { TServiceItem } from '@/Interface/TServiceItems';
import { useNavigate } from 'react-router-dom';
import DeleteServiceModal from './DeletaServiceModal';
import Loading from '@/Components/Loading';
import { useDeleteService } from '../hook/usedeleteService';
import { toast } from 'react-toastify';

const TicketServiceManager: React.FC = () => {
  const navigate = useNavigate();
  const languageId = useAuthStore((state) => state.id);

  const [typeOfCustomer, setTypeOfCustomer] = useState<'ADULT' | 'CHILDREN'>('ADULT');
  const [isAvailable, setIsAvailable] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = useService(
    languageId ?? '',
    typeOfCustomer,
    isAvailable ? 'true' : 'false',
    page.toString(),
    limit.toString()
  );

  const services: TServiceItem[] = data?.data ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<TServiceItem | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const availabilityMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    services.forEach((s) => {
      if (s.service_id) {
        map[s.service_id] = isAvailable;
      }
    });
    return map;
  }, [services, isAvailable]);

  const { mutate: deleteService, isPending } = useDeleteService({
    onSuccess: () => {
      const serviceName = selectedService?.service_name;
      const status = availabilityMap[selectedService?.service_id || ''];
      toast.success(`${status ? 'Đã khóa' : 'Đã mở khóa'} dịch vụ ${serviceName}`);
      setIsModalOpen(false);
      setSelectedService(null);
      refetch?.();
    },
    onError: () => {
      toast.error(`Lỗi khi cập nhật trạng thái dịch vụ ${selectedService?.service_name}`);
    },
  });

  const handleDelete = (service: TServiceItem) => {
    setSelectedService(service);
    setIsUnlocking(!availabilityMap[service.service_id || '']);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      deleteService(selectedService.service_id!);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Radio.Group value={typeOfCustomer} onChange={(e) => setTypeOfCustomer(e.target.value)}>
          <Radio.Button value="ADULT">Người Lớn</Radio.Button>
          <Radio.Button value="CHILDREN">Trẻ Em</Radio.Button>
        </Radio.Group>

        <Checkbox checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)}>
          Vé Đang Hoạt Động
        </Checkbox>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <ServiceTable
          data={services}
          showAddButton={true}
          onAdd={() => navigate('/create-ticket')}
          onEdit={(id) => navigate(`/edit-ticket/${id}`)}
          onDelete={(id) => {
            const found = services.find((s) => s.service_id === id);
            if (found) handleDelete(found);
          }}
          availabilityMap={availabilityMap}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.totalRecords ?? 0,
            showSizeChanger: true,
            onChange: (newPage, newLimit) => {
              setPage(newPage);
              setLimit(newLimit);
            },
          }}
        />
      )}

      <DeleteServiceModal
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        onConfirm={confirmDelete}
        serviceName={selectedService?.service_name}
        confirmLoading={isPending}
        isUnlocking={isUnlocking}
      />
    </div>
  );
};

export default TicketServiceManager;
