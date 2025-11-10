export const AuthFormType = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot',
} as const;

export type AuthFormType = typeof AuthFormType[keyof typeof AuthFormType];