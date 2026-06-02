import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './core/app.routes';
import { appProviders } from './core/providers/app-providers';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { userAuthInterceptor } from './user/interceptors/user-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        userAuthInterceptor,
        errorInterceptor,
      ])
    ),
    ...appProviders,
  ],
};
