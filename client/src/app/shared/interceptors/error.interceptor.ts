import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      switch (error.status) {
        case 0:
          message = 'Unable to connect to server';
          break;
        case 401:
          message = 'Session expired. Refreshing...';
          authService.refreshToken();
          break;
        case 403:
          message = 'You do not have permission to perform this action';
          break;
        case 404:
          message = 'Resource not found';
          break;
        case 422:
          message = error.error?.message || 'Validation error';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }

      notification.error(message);
      return throwError(() => error);
    })
  );
};
