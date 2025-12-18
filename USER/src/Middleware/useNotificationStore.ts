import { create } from "zustand";
import type { NotificationType } from "../Interface/Notification/INotification";


interface NotificationStore {
  notifications: NotificationType[];
  unreadCount: number;

  addNotification: (notif: NotificationType) => void;
  markAllAsRead: () => void;
  setNotifications: (list: NotificationType[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  setNotifications: (list) =>
    set(() => ({
      notifications: list,
      unreadCount: list.filter((n) => !n.read).length,
    })),
}));
