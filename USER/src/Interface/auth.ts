
export interface Login {
    username: string;
    password: string;
}

export interface LoginResponseTokenData {
  token: {
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    createdAt: string;
  };
  userName: string;
  user_id: string;
}




