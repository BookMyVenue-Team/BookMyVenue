export interface AuthResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
  emailVerified?: boolean;
  requiresVerification?: boolean;
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

export interface RefreshTokenApiResponse {
  userId: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  emailVerified?: boolean;
  requiresVerification?: boolean;
}

// Phase 2: OTP Email Verification
export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
}
