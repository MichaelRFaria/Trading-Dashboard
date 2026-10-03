export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse =
  RegisterSuccessResponse | RegisterFailureResponse;

export type RegisterSuccessResponse = {
  success: boolean;
  message: string;
};

export type RegisterFailureResponse = {
  statusCode: number;
  error: string;
  message: string[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = LoginSuccess | LoginFailure;

export type LoginSuccess = {
  access_token: string;
};

export type LoginFailure = {
  message: string;
};

export type AuthenticatedUser = {
  sub: number;
  email: string;
  exp: number;
  iat: number;
};

export type AuthenticatedUserFailure = {
  status_code: number;
  message: string;
};

export type AuthenticatedUserResponse =
  AuthenticatedUser | AuthenticatedUserFailure;
