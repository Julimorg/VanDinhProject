
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingItem= {
  item_id:string;
  title: string;
  price: number;
  quantity: number;
  type: 'Người lớn' | 'Trẻ em';
  discountCode?: string;
}

export type  UserInfo ={
  name?: string;
  phone?: string;
  email?: string;
}

export type  BookingState = {
  selectedItems: BookingItem[];
  totalPrice: number;
  userInfo: UserInfo;
  bookingTime: string;
  discountCode?: string;
  setBooking: (items: BookingItem[], total: number, user: UserInfo, time: string) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      selectedItems: [],
      totalPrice: 0,
      userInfo: { name: '', phone: '', email: '' },
      bookingTime: '',
      setBooking: (items, total, user, time) =>
        set({ selectedItems: items, totalPrice: total, userInfo: user, bookingTime: time }),
      clearBooking: () => set({ selectedItems: [], totalPrice: 0, userInfo: { name: '', phone: '', email: '' }, bookingTime: ''}),
    }),
    {
      name: 'booking-storage', 
    }
  )
);



