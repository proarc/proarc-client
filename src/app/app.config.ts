import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthService } from './services/auth.service';
import { Configuration } from './shared/configuration';
import { ApiService } from './services/api.service';
import { UserSettings, UserSettingsService } from './shared/user-settings';
import { UIService } from './services/ui.service';
import { LayoutService } from './services/layout-service';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { DatePipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json?v=' + Date.now());
}

function initializeApp(auth: AuthService) {
  return auth.initializeApp();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNativeDateAdapter(),
    provideAppInitializer(() => initializeApp(inject(AuthService))),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js')
    }),
    TranslateService, DatePipe,
    Configuration, ApiService, AuthService, UIService, UserSettings, UserSettingsService,
    LayoutService
  ]
};
