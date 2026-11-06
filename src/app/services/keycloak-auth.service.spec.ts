import { TestBed } from '@angular/core/testing';
import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { KeycloakAuthService } from './keycloak-auth.service';
import { Configuration } from '../shared/configuration';

describe('Keycloak authentication mode', () => {
  let auth: KeycloakAuthService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: Configuration, useValue: { proarcUrl: '/api' } }] });
    auth = TestBed.inject(KeycloakAuthService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('bootstraps local mode without contacting Keycloak', async () => {
    const result = auth.initialize();
    http.expectOne('/api/auth/config').flush({ mode: 'proarc' });
    await result;
    expect(auth.configured).toBeTrue();
    expect(auth.isKeycloak).toBeFalse();
  });

  it('does not fall back to local mode after configuration fails', async () => {
    const result = auth.initialize();
    http.expectOne('/api/auth/config').flush({}, { status: 503, statusText: 'Unavailable' });
    await expectAsync(result).toBeRejected();
    expect(auth.configured).toBeFalse();
  });

  it('does not send tokens to another API context or host', () => {
    expect(auth.isApiUrl('/api/rest/v2/user')).toBeTrue();
    expect(auth.isApiUrl('/api-other/rest/v2/user')).toBeFalse();
    expect(auth.isApiUrl('https://attacker.example/api/rest/v2/user')).toBeFalse();
  });

  it('serializes refresh across concurrent API requests', async () => {
    let finish: (value: boolean) => void;
    const refresh = new Promise<boolean>(resolve => finish = resolve);
    const client = { authenticated: true, token: 'access-token',
      updateToken: jasmine.createSpy().and.returnValue(refresh) };
    (auth as any).client = client;
    const first = auth.accessToken();
    const second = auth.accessToken();
    expect(client.updateToken).toHaveBeenCalledOnceWith(30);
    finish(true);
    expect(await first).toBe('access-token');
    expect(await second).toBe('access-token');
  });

  it('changes password in the current window and returns to the current page', async () => {
    const open = spyOn(window, 'open');
    const client = { login: jasmine.createSpy().and.resolveTo() };
    auth.isKeycloak = true;
    (auth as any).client = client;
    await auth.changePassword();
    expect(client.login).toHaveBeenCalledOnceWith({ action: 'UPDATE_PASSWORD',
      redirectUri: location.origin + location.pathname + location.search });
    expect(open).not.toHaveBeenCalled();
  });

  it('preserves the return address across the Keycloak login redirect', async () => {
    const originalUrl = location.href;
    const client = { login: jasmine.createSpy().and.resolveTo() };
    auth.isKeycloak = true;
    (auth as any).client = client;
    try {
      history.replaceState(null, '', '/login?url=%2Fprocess-management%3Fstate%3Drunning');
      await auth.login();
      expect(client.login).toHaveBeenCalledOnceWith({
        redirectUri: location.origin + '/login?url=%2Fprocess-management%3Fstate%3Drunning'
      });
    } finally {
      history.replaceState(null, '', originalUrl);
    }
  });

  it('propagates password change failures for the profile to display', async () => {
    auth.isKeycloak = true;
    (auth as any).client = { login: jasmine.createSpy().and.rejectWith(new Error('unavailable')) };
    await expectAsync(auth.changePassword()).toBeRejectedWithError('unavailable');
  });

  it('clears tokens when refresh fails', async () => {
    const client = { authenticated: true, token: 'old',
      updateToken: jasmine.createSpy().and.rejectWith(new Error('expired')),
      clearToken: jasmine.createSpy() };
    (auth as any).client = client;
    await expectAsync(auth.accessToken()).toBeRejectedWithError('expired');
    expect(client.clearToken).toHaveBeenCalled();
  });
});
