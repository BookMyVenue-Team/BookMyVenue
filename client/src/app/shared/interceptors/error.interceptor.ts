import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 = access token expired — try refresh then retry
      // 403 is NOT a token error; it means the user lacks permission — do not refresh
      // Exclude auth endpoints from auto-refresh
      if (error.status === 401 &&
          !req.url.includes('/auth/login') &&
          !req.url.includes('/auth/register') &&
          !req.url.includes('/auth/refresh-token') &&
          !req.url.includes('/auth/logout')) {

        return authService.refreshToken().pipe(
          switchMap(() => next(req)),  // retry original request with new cookie
          catchError((refreshError) => {
            // refresh token also expired — force logout
            authService.handleLogout();
            notification.error('Session expired. Please log in again.');
            return throwError(() => refreshError);
          })
        );
      }

      let message = error.error?.message || 'An unexpected error occurred';
      switch (error.status) {
        case 0:   message = 'Unable to connect to server'; break;
        case 403: message = error.error?.message; break;
        case 404: message = error.error?.message || 'Resource not found'; break;
        case 500: message = 'Server error. Please try again later.'; break;
      }

      // Do not display global notifications for auth endpoints - they handle their own errors
      const isAuthEndpoint = req.url.includes('/auth/login') ||
                           req.url.includes('/auth/register') ||
                           req.url.includes('/auth/forgot-password') ||
                           req.url.includes('/auth/reset-password');
      if (!isAuthEndpoint && message) {
        notification.error(message);
      }
      return throwError(() => error);
    })
  );
};
