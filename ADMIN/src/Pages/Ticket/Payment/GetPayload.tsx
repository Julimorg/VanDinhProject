import { CustomerType, OrderPayload } from '@/Interface/SendOder';
import { BookingItem, UserInfo } from '@/Store/BookingStore';

export function getBookingPayload(selectedItems: BookingItem[], userInfo: UserInfo): OrderPayload {
  const services = selectedItems.map((item) => {
    const service = {
      service_id: item.item_id,
      quantity: item.quantity,
      price: item.price,
      customerType:
        item.type === 'Người lớn' ? ('ADULT' as CustomerType) : ('CHILDREN' as CustomerType),
    };

    if (item.discountCode?.trim()) {
      return {
        ...service,
        discount_code: item.discountCode.trim(),
      };
    }

    return service;
  });

  const payload: OrderPayload = {
    services,
    ...(userInfo.name && { customer_name: userInfo.name }),
    ...(userInfo.phone && { customer_phone_number: userInfo.phone }),
    ...(userInfo.email && { customer_email: userInfo.email }),
  };

  return payload;
}
