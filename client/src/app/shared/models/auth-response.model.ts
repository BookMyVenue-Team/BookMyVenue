export interface AuthResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
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
