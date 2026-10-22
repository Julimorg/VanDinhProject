export interface AuthState {
  /** Chi luu trong memory (khong persist xuong localStorage) - xem useAuthStoreWithLocal.ts. */
  accessToken: string | null;
  userName: string | null;
  email?: string | null;
  userImg?: string | null;
  id: string | null;
  /** True khi da thu silent-refresh (hoac xac dinh khong can) luc app khoi dong. */
  isBootstrapped: boolean;
  setAuth: (
    accessToken: string | null,
    userName: string | null,
    email: string | null,
    userImg: string | null,
    id: string | null
  ) => void;
  clearAuth: () => void;
  setBootstrapped: (value: boolean) => void;
}
