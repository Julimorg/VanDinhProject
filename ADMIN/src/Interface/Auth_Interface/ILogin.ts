
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
  id: string,
  userName: string,
  accessToken: string,
  refreshToken: string,
  authenticated: boolean,
}




