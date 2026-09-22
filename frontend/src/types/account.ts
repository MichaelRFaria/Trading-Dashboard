export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string | string[]; // string[] for AccountDto class validator error messages
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = LoginSuccess | LoginFailure;

export type LoginSuccess = {
  success: true;
  access_token: string;
};

export type LoginFailure = {
  success: false;
  message: string;
};

export type AuthenticatedUser = {
  sub: number;
  email: string;
  exp: number;
  iat: number;
};
