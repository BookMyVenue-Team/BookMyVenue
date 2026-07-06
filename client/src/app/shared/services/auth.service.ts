import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRepository } from './auth.repository';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import {
  AuthResponse,
  AuthUser,
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  VerifyEmailRequest,
  ResendOtpRequest,
  OtpResponse,
} from '../models/auth-response.model';
import { UserRole } from '../enums/user-role.enum';
import { AUTH_ERRORS } from '../constants/auth-errors.constant';
import { map, Observable } from 'rxjs';

export class EmailNotVerifiedError extends Error {
  readonly email: string;
  constructor(email: string) {
    super('Email not verified');
    this.name = 'EmailNotVerifiedError';
    this.email = email;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authRepository = inject(AuthRepository);
  private readonly storage = inject(StorageService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  readonly userSession = signal<AuthUser | null>(null);
  readonly vendorSession = signal<AuthUser | null>(null);
  readonly adminSession = signal<AuthUser | null>(null);
  readonly pendingVerificationEmail = signal<string | null>(null);

  readonly currentUser = computed(() => {
    const portal = this.detectPortal();
    if (portal === 'admin') return this.adminSession();
    if (portal === 'vendor') return this.vendorSession();
    return this.userSession();
  });

  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly loading = signal(false);

  constructor() {
    this.loadAllSessions();
  }

  private portalKeys(portal: string): { token: string; refresh: string; user: string } {
    return {
      token: `bmv_${portal}_token`,
      refresh: `bmv_${portal}_refresh`,
      user: `bmv_${portal}_user`,
    };
  }

  private detectPortal(): string {
    const url = window.location.pathname || '';
    const routerUrl = this.router.url || '';
    if (url.startsWith('/admin') || routerUrl.startsWith('/admin')) return 'admin';
    if (url.startsWith('/vendor') || routerUrl.startsWith('/vendor')) return 'vendor';
    return 'user';
  }

  private loadAllSessions(): void {
    this.userSession.set(this.loadSession('user'));
    this.vendorSession.set(this.loadSession('vendor'));
    this.adminSession.set(this.loadSession('admin'));
  }

  private loadSession(portal: string): AuthUser | null {
    const keys = this.portalKeys(portal);
    const userJson = this.storage.get(keys.user);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        this.clearPortalSession(portal);
        return null;
      }
    }
    return null;
  }

  private savePortalSession(portal: string, token: string, refreshToken: string, user: AuthUser): void {
    const keys = this.portalKeys(portal);
    this.storage.set(keys.token, token);
    this.storage.set(keys.refresh, refreshToken);
    this.storage.set(keys.user, JSON.stringify(user));

    if (portal === 'admin') this.adminSession.set(user);
    else if (portal === 'vendor') this.vendorSession.set(user);
    else this.userSession.set(user);
  }

  private clearPortalSession(portal: string): void {
    const keys = this.portalKeys(portal);
    this.storage.remove(keys.token);
    this.storage.remove(keys.refresh);
    this.storage.remove(keys.user);
    this.storage.remove('accessToken');

    if (portal === 'admin') this.adminSession.set(null);
    else if (portal === 'vendor') this.vendorSession.set(null);
    else this.userSession.set(null);
  }

  private toAuthUser(response: AuthResponse): AuthUser {
    return { id: response.userId, name: response.name, email: response.email, role: response.role };
  }

  isPortalAuthenticated(role: UserRole): boolean {
    switch (role) {
      case UserRole.Admin: return this.adminSession() !== null;
      case UserRole.Vendor: return this.vendorSession() !== null;
      case UserRole.User: return this.userSession() !== null;
      default: return false;
    }
  }

  getPortalUser(role: UserRole): AuthUser | null {
    switch (role) {
      case UserRole.Admin: return this.adminSession();
      case UserRole.Vendor: return this.vendorSession();
      case UserRole.User: return this.userSession();
      default: return null;
    }
  }

  getToken(): string | null {
    const portal = this.detectPortal();
    return this.storage.get(this.portalKeys(portal).token);
  }

  getTokenForPortal(portal: string): string | null {
    return this.storage.get(this.portalKeys(portal).token);
  }

  getRefreshToken(): string | null {
    const portal = this.detectPortal();
    return this.storage.get(this.portalKeys(portal).refresh);
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  login(payload: LoginRequest): void {
    this.loading.set(true);
    this.authRepository.login(payload).subscribe({
      next: (response) => {
        if (response.requiresVerification && !response.emailVerified) {
          this.loading.set(false);
          this.pendingVerificationEmail.set(payload.email);
          this.notification.error('Please verify your email first');
          return;
        }
        const user = this.toAuthUser(response);
        const portal = response.role === UserRole.Vendor ? 'vendor' : 'user';
        // Tokens are in cookies - read from storage (cookies are set by browser via Set-Cookie header)
        const token = this.storage.get('accessToken') || '';
        const refreshToken = this.storage.get('refreshToken') || '';
        this.savePortalSession(portal, token, refreshToken, user);
        this.notification.success('Login successful');
        this.router.navigate(portal === 'vendor' ? ['/vendor/dashboard'] : ['/user/venues']);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 403 && err.error?.code === AUTH_ERRORS.EMAIL_NOT_VERIFIED) {
          this.loading.set(false);
          this.pendingVerificationEmail.set(payload.email);
          this.notification.error('Please verify your email first');
          return;
        }
        this.notification.error('Invalid credentials');
        this.loading.set(false);
      },
    });
  }

  adminLogin(payload: LoginRequest): void {
    this.loading.set(true);
    this.authRepository.adminLogin(payload).subscribe({
      next: (response) => {
        if (response.requiresVerification && !response.emailVerified) {
          this.loading.set(false);
          this.pendingVerificationEmail.set(payload.email);
          this.notification.error('Please verify your email first');
          return;
        }
        const user = this.toAuthUser(response);
        // Tokens are in cookies - read from storage (cookies are set by browser via Set-Cookie header)
        const token = this.storage.get('accessToken') || '';
        const refreshToken = this.storage.get('refreshToken') || '';
        this.savePortalSession('admin', token, refreshToken, user);
        this.notification.success('Login successful');
        this.router.navigate(['/admin/dashboard']);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 403 && err.error?.code === AUTH_ERRORS.EMAIL_NOT_VERIFIED) {
          this.loading.set(false);
          this.pendingVerificationEmail.set(payload.email);
          this.notification.error('Please verify your email first');
          return;
        }
        this.notification.error('Invalid credentials');
        this.loading.set(false);
      },
    });
  }

  signup(payload: SignupRequest): Observable<AuthResponse> {
    this.loading.set(true);
    return this.authRepository.signup(payload).pipe(
      map((response) => {
        this.loading.set(false);
        return response;
      })
    );
  }

  forgotPassword(payload: ForgotPasswordRequest, onSuccess?: () => void): void {
    this.loading.set(true);
    this.authRepository.forgotPassword(payload).subscribe({
      next: () => {
        this.notification.success('OTP sent to your email');
        this.loading.set(false);
        if (onSuccess) {
          onSuccess();
        }
      },
      error: () => {
        this.notification.error('Failed to send OTP');
        this.loading.set(false);
      },
    });
  }

  resetPassword(payload: { email: string; otp: string; newPassword: string }, onSuccess?: () => void): void {
    this.loading.set(true);
    this.authRepository.resetPassword(payload).subscribe({
      next: () => {
        this.notification.success('Password reset successful');
        this.loading.set(false);
        if (onSuccess) {
          onSuccess();
        }
      },
      error: () => {
        this.notification.error('Failed to reset password');
        this.loading.set(false);
      },
    });
  }

  logout(): void {
    const portal = this.detectPortal();
    this.authRepository.logout().subscribe({
      next: () => {
        this.clearPortalSession(portal);
        this.router.navigate(['/']);
        this.notification.info('Logged out successfully');
      },
      error: () => {
        this.clearPortalSession(portal);
        this.router.navigate(['/']);
      },
    });
  }

refreshToken(): Observable<void> {
  return this.authRepository.refreshToken().pipe(
    map(() => void 0)
  );
}

handleLogout(): void {
  const portal = this.detectPortal();
  this.clearPortalSession(portal);
  this.router.navigate(['/login']);
}

verifyEmail(payload: VerifyEmailRequest): Observable<AuthResponse> {
  return this.authRepository.verifyEmail(payload);
}

resendOtp(payload: ResendOtpRequest): Observable<OtpResponse> {
  return this.authRepository.resendOtp(payload);
}

clearPendingVerification(): void {
  this.pendingVerificationEmail.set(null);
}

}
