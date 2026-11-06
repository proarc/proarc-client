import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { KeycloakAuthService } from '../services/keycloak-auth.service';
import { bearerInterceptor } from './bearer.interceptor';
import { ProtectedResourcePipe, ProtectedResourceService } from './protected-resource.pipe';

describe('Bearer requests and protected media', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let auth: any;

  beforeEach(() => {
    auth = { isKeycloak: true,
      isApiUrl: (url: string) => url.startsWith('/api/'),
      accessToken: jasmine.createSpy().and.resolveTo('access-token'),
      clear: jasmine.createSpy() };
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptors([bearerInterceptor])), provideHttpClientTesting(),
      { provide: KeycloakAuthService, useValue: auth }
    ] });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });
  afterEach(() => controller.verify());

  it('adds bearer to API mutations and preserves their body', async () => {
    const body = { id: 7 };
    const response = firstValueFrom(http.post('/api/rest/v2/object', body));
    await Promise.resolve();
    const request = controller.expectOne('/api/rest/v2/object');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    expect(request.request.withCredentials).toBeFalse();
    expect(request.request.body).toBe(body);
    request.flush({});
    await response;
  });

  it('leaves local requests unchanged and never asks for a token', async () => {
    auth.isKeycloak = false;
    const response = firstValueFrom(http.get('/api/rest/v2/user'));
    const request = controller.expectOne('/api/rest/v2/user');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
    await response;
    expect(auth.accessToken).not.toHaveBeenCalled();
  });

  it('never adds bearer to external requests', async () => {
    const response = firstValueFrom(http.get('https://external.example/file'));
    const request = controller.expectOne('https://external.example/file');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
    await response;
    expect(auth.accessToken).not.toHaveBeenCalled();
  });

  for (const status of [401, 403, 503]) {
    it('handles ' + status + ' without replaying the request', async () => {
      const response = firstValueFrom(http.get('/api/rest/v2/user'));
      await Promise.resolve();
      controller.expectOne('/api/rest/v2/user').flush({}, { status, statusText: 'Denied' });
      await expectAsync(response).toBeRejected();
      expect(auth.clear.calls.count()).toBe(status === 401 ? 1 : 0);
      expect(auth.accessToken.calls.count()).toBe(1);
    });
  }

  it('loads a thumbnail through bearer and releases its object URL', async () => {
    spyOn(URL, 'createObjectURL').and.returnValue('blob:thumbnail');
    const revoke = spyOn(URL, 'revokeObjectURL');
    const pipe = new ProtectedResourcePipe(http, auth);
    const result = firstValueFrom(pipe.transform('/api/rest/v2/thumbnail'));
    await Promise.resolve();
    const request = controller.expectOne('/api/rest/v2/thumbnail');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush(new Blob(['image'], { type: 'image/png' }));
    expect(await result).toBe('blob:thumbnail');
    pipe.ngOnDestroy();
    expect(revoke).toHaveBeenCalledWith('blob:thumbnail');
  });

  it('loads viewer and EPUB bytes through the interceptor', async () => {
    spyOn(URL, 'createObjectURL').and.returnValue('blob:resource');
    const revoke = spyOn(URL, 'revokeObjectURL');
    const resources = new ProtectedResourceService(http, auth);
    const result = resources.load('/api/rest/v2/object/dissemination');
    await Promise.resolve();
    const request = controller.expectOne('/api/rest/v2/object/dissemination');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush(new Blob(['data']));
    const resource = await result;
    resource.dispose();
    expect(revoke).toHaveBeenCalledWith('blob:resource');
  });
});
