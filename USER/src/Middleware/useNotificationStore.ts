import { create } from "zustand";
import type { NotificationType } from "../Interface/Notification/INotification";


interface NotificationStore {
  notifications: NotificationType[];
  unreadCount: number;

  addNotification: (notif: NotificationType) => void;
  markAllAsRead: () => void;
  setNotifications: (list: NotificationType[]) => void;
  setUnreadCount: (count: number) => void;
}


export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notif) =>
    set((state) => {
      if (state.notifications.some((n) => n.id === notif.id)) return state;

      return {
        notifications: [notif, ...state.notifications],
        unreadCount: state.unreadCount + (notif.read ? 0 : 1),
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  setNotifications: (list) =>
    set(() => ({
      notifications: list,
    })),

  setUnreadCount: (count) =>
    set(() => ({
      unreadCount: count,
    })),
}));

