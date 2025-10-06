
export interface ILoginRequest {
    username: string;
    password: string;
}

export interface ILoginResponse {
  id: string,
  userName: string,
  email?: string;
  userImg?: string;
  accessToken: string,
  refreshToken: string,
  authenticated: boolean,
}

