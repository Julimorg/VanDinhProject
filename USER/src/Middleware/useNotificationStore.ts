import { create } from "zustand";
import type { NotificationType } from "../Interface/Notification/INotification";

interface NotificationStore {
  notifications: NotificationType[];
  unreadCount: number;

  // Thêm notification mới vào list (KHÔNG tự tính lại unreadCount ở đây).
  // unreadCount luôn được cập nhật riêng qua setUnreadCount(), lấy giá trị
  // chính xác từ server (BE gửi qua socket /user/queue/unread-count).
  // Lý do: BE gửi 2 message độc lập (full notification + unread count) cho
  // mỗi sự kiện. Nếu FE tự +1 ở đây thì dễ bị đếm trùng hoặc lệch khi 2
  // message tới không cùng lúc / bị mất 1 trong 2 do mạng chập chờn.
  addNotification: (notif: NotificationType) => void;

  // Đánh dấu đã đọc TẤT CẢ ở phía client (dùng cho optimistic update khi
  // bấm "Đánh dấu đã đọc" trước khi có phản hồi socket/API xác nhận).
  markAllAsRead: () => void;

  // Đánh dấu đã đọc 1 notification cụ thể (optimistic update cho markAsRead
  // của từng item). Không tự trừ unreadCount ở đây — chờ server gửi lại
  // count mới qua socket để đảm bảo chính xác.
  markOneAsRead: (id: string) => void;

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
        // KHÔNG cộng unreadCount ở đây nữa — chờ message riêng từ
        // /user/queue/unread-count để lấy số chính xác từ server.
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      // Optimistic: set về 0 ngay cho UI mượt. Nếu server trả về số khác
      // (vd: có notification mới phát sinh đúng lúc đó), setUnreadCount
      // từ socket sẽ ghi đè lại giá trị đúng ngay sau đó.
      unreadCount: 0,
    })),

  markOneAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      // Không tự trừ unreadCount — chờ server push count mới qua socket
      // (xem phần BE fix cho markAsRead bên dưới).
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