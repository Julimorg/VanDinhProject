import { create } from "zustand";
import type { NotificationType } from "../Interface/Notification/INotification";


interface NotificationStore {
  notifications: NotificationType[];

  addNotification: (notif: NotificationType) => void;
  markAllAsRead: () => void;
  setNotifications: (list: NotificationType[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notif) =>
    set((state) => {
      // tránh duplicate
      if (state.notifications.some((n) => n.id === notif.id)) {
        return state;
      }
      return { notifications: [notif, ...state.notifications] };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  setNotifications: (list) =>
    set(() => ({
      notifications: list,
    })),
}));

