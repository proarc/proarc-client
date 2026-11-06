import { Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeycloakAuthService } from '../services/keycloak-auth.service';

@Injectable({ providedIn: 'root' })
export class ProtectedResourceService {
  constructor(private http: HttpClient, private auth: KeycloakAuthService) {}

  async load(url: string): Promise<{ url: string; dispose: () => void }> {
    if (!this.auth.isKeycloak || !this.auth.isApiUrl(url)) return { url, dispose: () => {} };
    const blob = await firstValueFrom(this.http.get(url, { responseType: 'blob' }));
    const objectUrl = URL.createObjectURL(blob);
    return { url: objectUrl, dispose: () => URL.revokeObjectURL(objectUrl) };
  }
}

@Pipe({ name: 'protectedResource', standalone: true })
export class ProtectedResourcePipe implements PipeTransform, OnDestroy {
  private currentUrl: string;
  constructor(private http: HttpClient, private auth: KeycloakAuthService) {}

  transform(url: string): Observable<string> {
    if (!url || !this.auth.isKeycloak || !this.auth.isApiUrl(url)) return of(url);
    return this.http.get(url, { responseType: 'blob' }).pipe(map(blob => {
      if (this.currentUrl) URL.revokeObjectURL(this.currentUrl);
      return this.currentUrl = URL.createObjectURL(blob);
    }));
  }

  ngOnDestroy(): void {
    if (this.currentUrl) URL.revokeObjectURL(this.currentUrl);
  }
}
