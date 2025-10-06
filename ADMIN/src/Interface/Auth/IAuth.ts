export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  email?: string | null;
  userImg?: string | null;
  id: string | null;
  setTokens: (
    accessToken: string | null,
    refreshToken: string | null, 
    userName: string | null, 
    email: string | null,
    userImg: string | null,
    id: string | null, ) => void;
  clearTokens: () => void;
}


