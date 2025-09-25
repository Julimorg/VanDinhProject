import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Định nghĩa interface cho state
interface DeviceState {
  ipAddress: string;
  setIpAddress: (ip: string) => void;
}

// Tạo store với persist middleware
export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      ipAddress: 'Đang tải...',
      setIpAddress: (ip: string) => set({ ipAddress: ip }),
    }),
    {
      name: 'device-storage', // Tên key trong local storage
      storage: createJSONStorage(() => localStorage), // Lưu vào localStorage
    }
  )
);