export type UserStatus = "ACTIVE" | "INACTIVE";

export const STATUS_MAP: Record<UserStatus, string> = {
  ACTIVE: 'Đang Hoạt Động',
  INACTIVE: 'Bị Hạn Chế',
};
