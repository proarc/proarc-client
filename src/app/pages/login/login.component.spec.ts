import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../shared/auth.guard';

describe('Login return address', () => {
  let router: Router;
  let auth: any;
  let route: any;
  let component: LoginComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    auth = {
      isLoggedIn: () => true,
      keycloak: { configured: true, isKeycloak: false },
      login: (_username: string, _password: string, callback: (result: boolean) => void) => callback(true)
    };
    route = { snapshot: { queryParams: {} } };
    component = new LoginComponent(auth as AuthService, null, router, route as ActivatedRoute, null, null);
  });

  function expectDestination(url: string) {
    const [target, options] = (router.navigateByUrl as jasmine.Spy).calls.mostRecent().args;
    expect(router.serializeUrl(target)).toBe(url);
    expect(options).toEqual({ replaceUrl: true });
  }

  it('returns from Keycloak to the original page with query parameters and fragment', () => {
    route.snapshot.queryParams = { url: '/process-management?state=running#batch-123' };
    component.ngOnInit();
    expectDestination('/process-management?state=running#batch-123');
  });

  it('uses search when no original address was provided', () => {
    component.ngOnInit();
    expectDestination('/search');
  });

  it('returns to the original page after local login too', () => {
    auth.isLoggedIn = () => false;
    route.snapshot.queryParams = { url: '/process-management?state=running' };
    component.ngOnInit();
    component.onSubmit({ value: { username: 'user', password: 'password' } } as NgForm);
    expectDestination('/process-management?state=running');
  });

  it('supports existing login links with query parameters stored separately', () => {
    route.snapshot.queryParams = { url: '/process-management', state: 'running' };
    component.ngOnInit();
    expectDestination('/process-management?state=running');
  });

  it('carries the complete protected URL to the login page', () => {
    auth.user = null;
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const guard = new AuthGuard(auth as AuthService, router);
    expect(guard.canActivate({} as any,
      { url: '/process-management?state=running#batch-123' } as any)).toBeFalse();
    expect(navigate).toHaveBeenCalledOnceWith(['/login'], {
      queryParams: { url: '/process-management?state=running#batch-123' }
    });
  });
});
