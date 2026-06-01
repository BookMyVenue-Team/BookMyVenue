export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  isVendor?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
