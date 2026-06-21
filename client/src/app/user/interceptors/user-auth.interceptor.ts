import { HttpInterceptorFn } from '@angular/common/http';

export const userAuthInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};
