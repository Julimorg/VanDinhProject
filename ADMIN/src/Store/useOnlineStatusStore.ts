
import { create } from 'zustand';
import { IGetUserOnlineStatus } from '@/Interface/Notification/IGetUserOnlineStatus';

interface OnlineStatusState {

  onlineUsers: Map<string, IGetUserOnlineStatus>;

  updateUserStatus: (status: IGetUserOnlineStatus) => void;
  isUserOnline: (userId: string) => boolean;
  clearAll: () => void;
}

export const useOnlineStatusStore = create<OnlineStatusState>((set, get) => ({
  onlineUsers: new Map(),

  //? Update user status
  updateUserStatus: (status) => {
    set((state) => {
      const newMap = new Map(state.onlineUsers);
      newMap.set(status.userId, status);
      return { onlineUsers: newMap };
    });
  },

  //? Check if user is online
  isUserOnline: (userId) => {
    const status = get().onlineUsers.get(userId);
    return status?.socketId !== null && status?.socketId !== undefined;
  },

  //? Clear all 
  clearAll: () => {
    set({ onlineUsers: new Map() });
  },
  
}

));