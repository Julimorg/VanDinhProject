
export interface ILoginRequest {
    username: string;
    password: string;
}

export interface ILoginResponse {
  id: string,
  userName: string,
  email: string,
  userImg: string,
  accessToken: string,
  refreshToken: string,
  authenticated: boolean,
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  email: string | null;
  userImg: string | null;
  id: string | null;
  setTokens: (
    accessToken: string | null,
    refreshToken: string | null, 
    userName: string | null, 
    id: string | null, 
    email: string | null, 
    userImg: string | null) => void;
  clearTokens: () => void;
}



