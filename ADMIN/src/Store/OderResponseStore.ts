import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderResponse } from '@/Interface/SendOder';

type OrderResponseState = {
  orderResponse: OrderResponse | null;
  setOrderResponse: (data: OrderResponse) => void;
  clearOrderResponse: () => void;
};

export const useOrderResponseStore = create<OrderResponseState>()(
  persist(
    (set) => ({
      orderResponse: null,
      setOrderResponse: (data) => set({ orderResponse: data }),
      clearOrderResponse: () => set({ orderResponse: null }),
    }),
    {
      name: 'order-response-storage', 
    }
  )
);
