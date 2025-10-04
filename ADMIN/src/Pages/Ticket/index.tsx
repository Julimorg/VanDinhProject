import { useState } from 'react';
import ProductCard from '@/Components/ProductCard';
import ButtonText from '@/Components/ButtonText-H';
import { useCurrentTime } from '../../Utils/ulti';
import ComboCard from '@/Components/ComboCard';
import { useService } from './Hook/useGetService';
import { TServiceItem } from '@/Interface/TServiceItems';
import Loading from '@/Components/Loading';
import TextBigTitle from '@/Components/TextBigTitle/TextBigTitle';
import SelectedItem from './Component/selectedItems';
import UserForm from './Component/userForm';
import { useBookingStore } from '@/Store/BookingStore';
import { useNavigate } from 'react-router-dom';
import { useSendOrder } from './Hook/useSendOder';
import { getBookingPayload } from '@/Pages/Ticket/Payment/GetPayload';
import { useOrderResponseStore } from '@/Store/OderResponseStore';
import { formatCurrency } from '@/Utils/ulti';
import { useAuthStore } from '@/Store/IAuth';
import { useShiftStore } from '@/Hook/LocalUseContext/CrashierShift/ShiftProvider';

const CurrentTime: React.FC = () => {
  const time = useCurrentTime();
  return <span>{time}</span>;
};

const Ticket: React.FC = () => {
  const navigate = useNavigate();
  const sendOrder = useSendOrder();
  const languageID = useAuthStore((state) => state.id);
  const { checkOnShift } = useShiftStore();
  const { selectedItems, userInfo, setBooking } = useBookingStore();
  const setOrderResponse = useOrderResponseStore((state) => state.setOrderResponse);

  const [selectedType, setSelectedType] = useState<'Người lớn' | 'Trẻ em'>('Người lớn');
  const selectedParam = selectedType === 'Trẻ em' ? 'CHILDREN' : 'ADULT';
  const currentTime = useCurrentTime();

  const { data, isLoading } = useService(languageID!, selectedParam, 'true');
  const services: TServiceItem[] = Array.isArray(data) ? data : [];

  const comboItems = services.filter((item) => item.is_Combo);
  const productItems = services.filter((item) => !item.is_Combo);

  const handleAddItem = (service: TServiceItem) => {
    const title = service.service_name;
    const item_id = service.service_id!;
    const numericPrice = service.discount_price || service.origin_price;

    useBookingStore.setState((state) => {
      const existingItem = state.selectedItems.find(
        (item) =>
          item.item_id === item_id &&
          item.title === title &&
          item.price === numericPrice &&
          item.type === selectedType
      );

      let newItems;
      if (existingItem) {
        newItems = state.selectedItems.map((item) =>
          item.item_id === item_id &&
          item.title === title &&
          item.price === numericPrice &&
          item.type === selectedType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [
          ...state.selectedItems,
          {
            item_id,
            title,
            price: numericPrice,
            quantity: 1,
            type: selectedType,
            discountCode: '',
          },
        ];
      }

      const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      return { selectedItems: newItems, totalPrice };
    });
  };

  const handleItemAction = (
    title: string,
    type: 'Người lớn' | 'Trẻ em',
    action: 'increase' | 'decrease' | 'remove' | 'set',
    value?: number
  ) => {
    useBookingStore.setState((state) => {
      let newItems;
      switch (action) {
        case 'increase':
          newItems = state.selectedItems.map((item) => {
            if (item.title === title && item.type === type) {
              const newQuantity = Math.min(item.quantity + 1, 20);
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          break;
        case 'decrease':
          newItems = state.selectedItems.flatMap((item) => {
            if (item.title === title && item.type === type) {
              return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
            }
            return [item];
          });
          break;
        case 'remove':
          newItems = state.selectedItems.filter(
            (item) => item.title !== title || item.type !== type
          );
          break;
        case 'set':
          if (value && value >= 1) {
            const newValue = Math.min(value, 20);
            newItems = state.selectedItems.map((item) =>
              item.title === title && item.type === type ? { ...item, quantity: newValue } : item
            );
          } else {
            newItems = state.selectedItems.filter(
              (item) => item.title !== title || item.type !== type
            );
          }
          break;
        default:
          newItems = state.selectedItems;
      }

      const totalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      return { selectedItems: newItems, totalPrice };
    });
  };

  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một dịch vụ hoặc combo!');
      return;
    }

    setBooking(selectedItems, totalPrice, userInfo, currentTime);

    const payload = getBookingPayload(selectedItems, userInfo);
    try {
      const response = await sendOrder.mutateAsync(payload);
      setOrderResponse(response);
      console.log('ordersuccess:', response);
      navigate('/pay-info');
    } catch (error) {
      alert('Đặt vé thất bại, vui lòng thử lại!');
      console.log(error);
    }
  };

  if (isLoading) return <Loading />;

  const renderServiceCard = (service: TServiceItem) => {
    const displayPrice = service.discount_price ?? service.origin_price ?? 0;

    if (service.is_Combo) {
      return (
        <ComboCard
          key={service.service_id}
          imageUrl={service.image}
          title={service.service_name}
          description={service.service_description ?? ''}
          oldPrice={service.origin_price ?? 0}
          newPrice={displayPrice}
          discountpercen={service.discount_value_vnd}
          onAdd={() => handleAddItem(service)}
        />
      );
    }

    return (
      <ProductCard
        key={service.service_id}
        imageUrl={service.image}
        title={service.service_name}
        oldPrice={service.origin_price ?? 0}
        newPrice={displayPrice}
        discountpercen={service.discount_value_vnd}
        onAdd={() => handleAddItem(service)}
      />
    );
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6 p-4">
        <div className="col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <TextBigTitle $fontSize="30px" title="Chọn loại vé:" />
            <ButtonText
              label="Người lớn"
              selected={selectedType === 'Người lớn'}
              onClick={() => setSelectedType('Người lớn')}
            />
            <ButtonText
              label="Trẻ em"
              selected={selectedType === 'Trẻ em'}
              onClick={() => setSelectedType('Trẻ em')}
            />
          </div>

          <div>
            <TextBigTitle $fontSize="30px" title="Dịch vụ có sẵn" />
            <div className="grid grid-cols-2 gap-4">
              {productItems.length === 0 ? (
                <p>Không có dịch vụ nào</p>
              ) : (
                productItems.map(renderServiceCard)
              )}
            </div>
          </div>

          <div>
            <TextBigTitle $fontSize="30px" title="Gói combo" />
            <div className="grid grid-cols-2 gap-4">
              {comboItems.length === 0 ? (
                <p>Không có combo nào</p>
              ) : (
                comboItems.map(renderServiceCard)
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-[7.9rem] right-0 w-[38rem] p-4 border-l border-gray-300 z-[999] bg-white h-[49rem] flex flex-col">
        <div className="flex items-start justify-between mb-4 shrink-0">
          <UserForm onChange={(info) => useBookingStore.setState({ userInfo: info })} />
          <CurrentTime />
        </div>

        <ul className="flex-1 min-h-0 mb-3 space-y-3 overflow-y-auto">
          {selectedItems.map((item) => (
            <div key={`${item.item_id}-${item.type}`} className="pb-3 space-y-1 border-b">
              <SelectedItem
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                type={item.type}
                onAction={(action, value) => handleItemAction(item.title, item.type, action, value)}
              />

              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={item.discountCode || ''}
                onChange={(e) =>
                  useBookingStore.setState((state) => {
                    const updatedItems = state.selectedItems.map((i) =>
                      i.item_id === item.item_id && i.type === item.type
                        ? { ...i, discountCode: e.target.value }
                        : i
                    );
                    return { selectedItems: updatedItems };
                  })
                }
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </ul>

        <div className="shrink-0">
          <div className="flex items-center justify-between p-3 mb-4 border border-gray-300 rounded">
            <p className="text-base font-medium">TỔNG CỘNG</p>
            <p className="text-lg font-semibold">{formatCurrency(totalPrice)}</p>
          </div>

          {checkOnShift && (
            <p className="mb-2 text-sm font-medium text-center text-red-600">
              Bạn Cần Bắt Đầu Ca Làm Để Đặt Vé
            </p>
          )}

          <ButtonText
            label="Đặt Vé"
            onClick={handleOrder}
            disabled={checkOnShift}
            className={`w-full py-2 text-xl font-bold text-white rounded-lg shadow-md border-none focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              checkOnShift
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            }`}
          />
        </div>
      </div>
    </>
  );
};

export default Ticket;
