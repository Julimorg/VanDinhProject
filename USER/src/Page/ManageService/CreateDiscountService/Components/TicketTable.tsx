import React, { useState, useMemo } from 'react';
import { Radio, Checkbox } from 'antd';
import { useAuthStore } from '@/Store/auth';
import ServiceTable from '@/Components/Table/Servicetable';
import type { TServiceItem } from '@/Interface/TServiceItems';
import Loading from '@/Components/Loading';
import { useService } from '../../Ticket/hook/usegetService';

import dayjs from 'dayjs';
import { useCreateServiceDiscount } from '../hook/usecreateServiceDiscount';
import type { CreateDiscountService } from '@/Interface/TDiscountService';
import { toast } from 'react-toastify';
import CreateDiscountServiceModal from './CreateDiscountServiceModal';

const DiscountServiceManager: React.FC = () => {
  const languageId = useAuthStore((state) => state.id);

  const [typeOfCustomer, setTypeOfCustomer] = useState<'ADULT' | 'CHILDREN'>('ADULT');
  const [isAvailable, setIsAvailable] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const { data, isLoading, refetch } = useService(
    languageId ?? '',
    typeOfCustomer,
    isAvailable ? 'true' : 'false',
    page.toString(),
    limit.toString()
  );

  const { mutate: createDiscount, isPending } = useCreateServiceDiscount({
    onSuccess: () => {
      toast.success('Thêm giảm giá thành công');
      refetch();
    },
    onError: () => {
      toast.error('Thêm giảm giá thất bại');
    },
  });

  const services: TServiceItem[] = data?.data ?? [];
  const isServiceDiscounted = (service: TServiceItem) =>
    service.discount_value_vnd != null && service.discount_value_vnd !== 0;

  const availabilityMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    services.forEach((s) => {
      if (s.service_id) {
        map[s.service_id] = isAvailable;
      }
    });
    return map;
  }, [services, isAvailable]);

  const handleOpenModal = (id: string) => {
    const service = services.find((s) => s.service_id === id);
    if (!service) return;

    setSelectedServiceId(id);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedServiceId(undefined);
    setIsModalVisible(false);
  };

  const handleSubmitDiscount = (
    values: { dateRange: [dayjs.Dayjs, dayjs.Dayjs]; discount_value_vnd: number },
    serviceId?: string
  ) => {
    if (!serviceId) return;

    const [startDate, endDate] = values.dateRange;

    const payload: CreateDiscountService = {
      service_id: serviceId,
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: endDate.format('YYYY-MM-DD'),
      discount_type: 'PERCENTAGE',
      apply_for_target: typeOfCustomer,
      discount_value_vnd: values.discount_value_vnd,
    };

    createDiscount(payload);
    handleCloseModal();
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
          showAddButton={true}
          onAddicon={handleOpenModal}
          isDiscounted={isServiceDiscounted}
          actionsColumnTitle="Thêm khuyến mãi"
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
          data={services}
        />
      )}

      <CreateDiscountServiceModal
        visible={isModalVisible}
        serviceId={selectedServiceId}
        onClose={handleCloseModal}
        onSubmit={handleSubmitDiscount}
        confirmLoading={isPending}
      />
    </div>
  );
};

export default DiscountServiceManager;
