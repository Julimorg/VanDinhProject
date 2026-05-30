import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import POItemsTable from './Components/PurchaseItemsTablet';
import POInfoCards from './Components/PurchaseOrderDetailCard';
import PODetailHeader from './Components/PurchaseOrderDetailHeader';
import { useGetPurchaseOrderDetail } from './Hooks/useGetPurchaseOrderDetail';

const PurchaseOrderDetailPage: React.FC = () => {
  const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetPurchaseOrderDetail(purchaseOrderId);
  const detail = data?.data;

  useEffect(() => {
    if (isError) {
      toast.error('Không tìm thấy phiếu nhập kho');
      navigate('/inventory');
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#F4F5F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="min-h-screen" style={{ background: '#F4F5F7' }}>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
        <PODetailHeader
          data={{
            poCode: detail.poCode,
            status: detail.status,
            id: detail.purchaseOrderId,
            supplierName: detail.supplierName,
            note: detail.note,
          }}
          onBack={() => navigate('/inventory')}
        />
        <POInfoCards data={detail} />
        <POItemsTable items={detail.items} purchaseOrderId={purchaseOrderId!} />
      </div>
    </div>
  );
};

export default PurchaseOrderDetailPage;
