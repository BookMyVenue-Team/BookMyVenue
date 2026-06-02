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
} from '../models/auth-response.model';
import { ApiResponse } from '../models/api-response.model';

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

  signup(payload: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.SIGNUP}`,
      payload
    );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
      {}
    );
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
      { refreshToken }
    );
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      payload
    );
  }

  resetPassword(payload: ResetPasswordRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
      payload
    );
  }
}
