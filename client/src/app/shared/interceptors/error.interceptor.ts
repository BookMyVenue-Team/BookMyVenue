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
      // 401 = access token expired — try refresh then retry.
      // Auth endpoints (login, register, etc.) return 401/403 for business reasons
      // (invalid credentials, unverified email) — never treat those as an expired session.
      if (error.status === 401 && !req.url.includes('/auth/')) {

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
        case 403: message = error.error?.message || 'You do not have permission to perform this action'; break;
        case 404: message = error.error?.message || 'Resource not found'; break;
        case 500: message = 'Server error. Please try again later.'; break;
      }

      notification.error(message);
      return throwError(() => error);
    })
  );
};
