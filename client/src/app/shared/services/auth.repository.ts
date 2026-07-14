import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/config/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendOtpRequest,
  MessageResponse,
  RefreshTokenApiResponse,
  RefreshTokenRequest,
} from '../models/auth-response.model';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
      payload
    );
  }

  adminLogin(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.ADMIN_LOGIN}`,
      payload
    );
  }

  signup(payload: SignupRequest): Observable<MessageResponse> {
    const body = {
      name: `${payload.firstName} ${payload.lastName}`.trim(),
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: payload.isVendor ? 'VENDOR' : 'USER',
    };
    return this.http.post<MessageResponse>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.SIGNUP}`,
      body
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
      {}
    );
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenApiResponse> {
    const body: RefreshTokenRequest = { refreshToken };
    return this.http.post<RefreshTokenApiResponse>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
      body
    );
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      payload
    );
  }

  resetPassword(payload: ResetPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
      payload
    );
  }

  verifyEmail(payload: VerifyEmailRequest): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.VERIFY_EMAIL}`,
      payload
    );
  }

  resendOtp(payload: ResendOtpRequest): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.RESEND_VERIFICATION}`,
      payload
    );
  }
}
