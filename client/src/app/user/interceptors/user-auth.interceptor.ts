import { HttpInterceptorFn } from '@angular/common/http';

export const userAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    withCredentials: true,
  });
  return next(cloned);
};
