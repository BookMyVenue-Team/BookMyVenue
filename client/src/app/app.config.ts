import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withXsrfConfiguration, HttpInterceptorFn } from '@angular/common/http';
import { routes } from './core/app.routes';
import { appProviders } from './core/providers/app-providers';
import { errorInterceptor } from './shared/interceptors/error.interceptor';

const credentialsInterceptor: HttpInterceptorFn = (req, next) => 
  next(req.clone({withCredentials:true}));

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        credentialsInterceptor,
        errorInterceptor,
      ]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    ...appProviders,
  ],
};
