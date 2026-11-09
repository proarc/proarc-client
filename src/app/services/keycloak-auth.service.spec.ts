import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { KeycloakAuthService } from './keycloak-auth.service';
import { Configuration } from '../shared/configuration';
import { AuthService } from './auth.service';

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

  it('calculates token validity using the Keycloak clock skew and token lifetime', () => {
    spyOn(Date, 'now').and.returnValue(1000000);
    (auth as any).client = { authenticated: true, timeSkew: 20,
      tokenParsed: { iat: 900, exp: 1200 } };
    expect(auth.tokenTiming).toEqual({ remaining: 220, maximum: 300 });
  });

  it('clamps expired tokens and handles missing timing or authentication', () => {
    spyOn(Date, 'now').and.returnValue(1000000);
    const client = { authenticated: true, timeSkew: null as number | null, tokenParsed: { iat: 600, exp: 900 } };
    (auth as any).client = client;
    expect(auth.tokenTiming).toEqual({ remaining: 0, maximum: 300 });
    client.tokenParsed = { iat: 1100, exp: 1400 };
    expect(auth.tokenTiming).toEqual({ remaining: 300, maximum: 300 });
    client.authenticated = false;
    expect(auth.tokenTiming).toEqual({ remaining: 0, maximum: 0 });
    client.authenticated = true;
    client.tokenParsed = undefined;
    expect(auth.tokenTiming).toEqual({ remaining: 0, maximum: 0 });
  });

  it('updates the displayed counter after token refresh without polling or refreshing Keycloak', fakeAsync(() => {
    const now = Math.ceil(Date.now() / 1000);
    const client = { authenticated: true, timeSkew: 0,
      tokenParsed: { iat: now - 60, exp: now + 60 },
      updateToken: jasmine.createSpy('updateToken') };
    (auth as any).client = client;
    auth.isKeycloak = true;
    const httpClient = jasmine.createSpyObj('HttpClient', ['get']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const dialogs = jasmine.createSpyObj('MatDialog', ['closeAll']);
    const session = new AuthService(httpClient, auth, null, null, dialogs, null, router,
      null, null, new DatePipe('en-US'));
    session.user = {} as any;
    try {
      session.checkIsLogged();
      expect(session.remainingFormated).toBe('01:00');
      expect(session.remainingPercent).toBe(50);
      const timer = session.timerRemain;
      session.checkIsLogged();
      expect(session.timerRemain).toBe(timer);
      tick(1000);
      expect(session.remainingFormated).toBe('00:59');
      client.tokenParsed = { iat: now + 1, exp: now + 121 };
      tick(1000);
      expect(session.remainingFormated).toBe('01:59');
      expect(session.remainingPercent).toBeCloseTo(119 * 100 / 120);
      expect(httpClient.get).not.toHaveBeenCalled();
      expect(client.updateToken).not.toHaveBeenCalled();
      auth.loggedOut.next();
      expect(session.timerRemain).toBeNull();
      expect(session.isLoggedIn()).toBeFalse();
    } finally {
      session.setLoggedOut();
    }
  }));
});
