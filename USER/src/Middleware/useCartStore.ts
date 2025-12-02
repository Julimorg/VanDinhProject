import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  cartCount: number;
  setCartCount: (count: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartCount: 0,
      setCartCount: (count) => set({ cartCount: count }),
    }),
    {
      name: "cart-store",
    }
  )
);
