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
} from '../models/auth-response.model';
import { UserRole } from '../enums/user-role.enum';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authRepository = inject(AuthRepository);
  private readonly storage = inject(StorageService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  readonly userSession = signal<AuthUser | null>(null);
  readonly vendorSession = signal<AuthUser | null>(null);
  readonly adminSession = signal<AuthUser | null>(null);

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
    const url = this.router.url || window.location.pathname;
    if (url.startsWith('/admin')) return 'admin';
    if (url.startsWith('/vendor')) return 'vendor';
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
        const user = this.toAuthUser(response);
        const portal = response.role === UserRole.Vendor ? 'vendor' : 'user';
        this.savePortalSession(portal, response.accessToken || '', response.refreshToken || '', user);
        this.notification.success('Login successful');
        this.router.navigate(portal === 'vendor' ? ['/vendor/dashboard'] : ['/user/venues']);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Invalid credentials');
        this.loading.set(false);
      },
    });
  }

  adminLogin(payload: LoginRequest): void {
    this.loading.set(true);
    this.authRepository.adminLogin(payload).subscribe({
      next: (response) => {
        const user = this.toAuthUser(response);
        this.savePortalSession('admin', response.accessToken || '', response.refreshToken || '', user);
        this.notification.success('Login successful');
        this.router.navigate(['/admin/dashboard']);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Invalid credentials');
        this.loading.set(false);
      },
    });
  }

  signup(payload: SignupRequest): void {
    this.loading.set(true);
    this.authRepository.signup(payload).subscribe({
      next: (response) => {
        const user = this.toAuthUser(response);
        const portal = response.role === UserRole.Vendor ? 'vendor' : 'user';
        this.savePortalSession(portal, response.accessToken || '', response.refreshToken || '', user);
        this.notification.success(portal === 'vendor' ? 'Vendor account created successfully' : 'Account created successfully');
        this.router.navigate(portal === 'vendor' ? ['/vendor/dashboard'] : ['/user/venues']);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Signup failed. Please try again.');
        this.loading.set(false);
      },
    });
  }

  forgotPassword(payload: ForgotPasswordRequest): void {
    this.loading.set(true);
    this.authRepository.forgotPassword(payload).subscribe({
      next: () => {
        this.notification.success('Password reset email sent');
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Failed to send reset email');
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

}
