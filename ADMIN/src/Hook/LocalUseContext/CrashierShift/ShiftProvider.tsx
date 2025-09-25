// useShiftStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction } from '@/Interface/TShift';

type ShiftState = {
  checkOffShift: boolean;
  checkOnShift: boolean;
  timeOnShift: string;
  timeOffShift: string;
  transactions: Transaction[] | null;
  setCheckOffShift: (value: boolean) => void;
  setCheckOnShift: (value: boolean) => void;
  setTimeOnShift: (value: string) => void;
  setTimeOffShift: (value: string) => void;
  setTransactions: (transactions: Transaction[] | null) => void;
  resetShift: () => void;
};

// Config Zustand
export const useShiftStore = create<ShiftState>()(
  persist(
    (set) => ({
      checkOffShift: false,
      checkOnShift: true,
      timeOnShift: '',
      timeOffShift: '',
      transactions: null,
      setCheckOffShift: (value) => set({ checkOffShift: value }),
      setCheckOnShift: (value) => set({ checkOnShift: value }),
      setTimeOnShift: (value) => set({ timeOnShift: value }),
      setTimeOffShift: (value) => set({ timeOffShift: value }),
      setTransactions: (transactions) => set({ transactions }),
      resetShift: () =>
        set({
          checkOffShift: false,
          checkOnShift: true,
          timeOnShift: '',
          timeOffShift: '',
          transactions: null,
        }),
    }),
    {
      name: 'shift-storage',
    }
  )
);
