import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { firstValueFrom, Subject } from 'rxjs';
import type Keycloak from 'keycloak-js';
import { Configuration } from '../shared/configuration';

@Injectable({ providedIn: 'root' })
export class KeycloakAuthService {
  isKeycloak = false;
  configured = false;
  readonly loggedOut = new Subject<void>();
  private client: Keycloak;
  private initialization: Promise<void>;
  private refreshing: Promise<void>;
  private bootstrap: HttpClient;

  constructor(backend: HttpBackend, private config: Configuration) {
    this.bootstrap = new HttpClient(backend);
  }

  initialize(): Promise<void> {
    return this.initialization ??= this.initializeOnce();
  }

  private async initializeOnce(): Promise<void> {
    const config = await firstValueFrom(this.bootstrap.get<{ mode: string; issuer: string; clientId: string }>(
      this.config.proarcUrl + '/auth/config'));
    if (config.mode === 'proarc') { this.configured = true; return; }
    if (config.mode !== 'keycloak') throw new Error('Unknown authentication mode');
    this.isKeycloak = true;
    this.configured = true;
    const marker = config.issuer.lastIndexOf('/realms/');
    if (marker < 0) throw new Error('Invalid Keycloak issuer');
    const { default: Keycloak } = await import('keycloak-js');
    this.client = new Keycloak({ url: config.issuer.slice(0, marker),
      realm: decodeURIComponent(config.issuer.slice(marker + 8)), clientId: config.clientId });
    this.client.onAuthLogout = () => this.loggedOut.next();
    this.client.onAuthRefreshError = () => this.clear();
    await this.client.init({ onLoad: 'check-sso', flow: 'standard', pkceMethod: 'S256',
      scope: 'openid email', redirectUri: location.origin + location.pathname + location.search });
  }

  get authenticated(): boolean { return !!this.client?.authenticated; }

  get tokenTiming(): { remaining: number; maximum: number } {
    const token = this.client?.tokenParsed;
    if (!this.authenticated || !Number.isFinite(token?.exp) || !Number.isFinite(token?.iat)) {
      return { remaining: 0, maximum: 0 };
    }
    const maximum = Math.max(0, token.exp - token.iat);
    const remaining = token.exp - Math.ceil(Date.now() / 1000) + (this.client.timeSkew ?? 0);
    return { remaining: Math.max(0, Math.min(maximum, remaining)), maximum };
  }

  isApiUrl(value: string): boolean {
    const base = new URL(this.config.proarcUrl.replace(/\/$/, '') + '/', location.origin);
    const url = new URL(value, location.origin);
    return url.origin === base.origin && url.pathname.startsWith(base.pathname);
  }

  async accessToken(): Promise<string> {
    if (!this.authenticated) throw new Error('Keycloak login required');
    if (!this.refreshing) {
      this.refreshing = this.client.updateToken(30).then((): void => {})
        .catch(error => { this.clear(); throw error; })
        .finally(() => { this.refreshing = undefined; });
    }
    await this.refreshing;
    if (!this.authenticated || !this.client.token) throw new Error('Keycloak login required');
    return this.client.token;
  }

  login(): Promise<void> {
    if (!this.isKeycloak || !this.client) return Promise.reject(new Error('Keycloak unavailable'));
    return this.client.login({ redirectUri: location.origin + location.pathname + location.search });
  }

  async changePassword(): Promise<void> {
    if (!this.isKeycloak || !this.client) throw new Error('Keycloak unavailable');
    await this.client.login({
      action: 'UPDATE_PASSWORD',
      redirectUri: location.origin + location.pathname + location.search
    });
  }

  async logout(): Promise<void> {
    if (!this.client) return;
    const url = this.client.createLogoutUrl({ redirectUri: location.origin + location.pathname });
    this.clear();
    location.assign(url);
  }

  clear(): void {
    if (this.client?.token) this.client.clearToken();
    else this.loggedOut.next();
  }
}
