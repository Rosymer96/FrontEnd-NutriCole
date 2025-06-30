import { authInterceptor } from './interceptor/auth.interceptor';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es-ES' },
  ],
};
